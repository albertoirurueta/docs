# Implementation Plan: Guides & References / Backend Development — DDD and Microservices

## Task summary

Source: GitHub issue #152
Base branch: main

Issue [#152](https://github.com/albertoirurueta/docs/issues/152) asks for a new **DDD and Microservices** section
under *Guides & References → Backend Development*, the eighth sibling of the existing Hibernate, SpringBoot,
GraphQL, Spring Batch, OAuth, Quarkus and Messaging references, authored directly into this repo's own `ROOT`
Antora component (this repo has no application source code — it *is* the Antora playbook + root component, per
`CLAUDE.md`). Concretely:

1. **17 new AsciiDoc pages** under `modules/ROOT/pages/backend/ddd-microservices/`: a landing `index.adoc` (with
   a `== Bibliography`), **15 concept pages**, and a `cheat-sheet.adoc`.
2. **One new partial**: `modules/ROOT/partials/ddd-microservices-disclaimer.adoc` — like
   `messaging-disclaimer.adoc` (and unlike `oauth-disclaimer.adoc`/`springboot-disclaimer.adoc`), this contains
   **only** the house AI-assistance disclosure and the bibliography pointer, per the issue's explicit
   instruction that admonitions in this section state nothing else. The code baseline (Java 21, Spring Boot
   4.1.x, Spring Data JPA, Spring Modulith 2.x, Spring for Apache Kafka 4.1.x) goes in ordinary prose on
   `index.adoc` and each page's intro, never inside an admonition.
3. **Site wiring**: an inline nav block in `modules/ROOT/nav.adoc` appended after the Messaging block, a "DDD
   and Microservices" bullet in `modules/ROOT/pages/backend/index.adoc`, and DDD/saga/CQRS terms added to the
   root `modules/ROOT/pages/index.adoc` `:keywords:`.
4. **Reciprocal cross-links** added to `backend/springboot/architectural-patterns.adoc` (which explicitly says a
   deeper guide is "planned" — this plan removes that sentence and points at the new section instead),
   `backend/messaging/messaging-patterns-in-practice.adoc`, `backend/messaging/spring-boot-other-messaging-options.adoc`,
   `backend/quarkus/datasources-and-transactions.adoc`, `database/choosing-the-right-database.adoc`, and
   `backend/hibernate/locking.adoc`.
5. **One new cheat-sheet PDF**: `modules/ROOT/attachments/ddd-microservices-cheat-sheet.pdf`, exactly one A4
   page, rendered from a print-ready HTML/CSS layout via headless Chrome, visually consistent with
   `messaging-cheat-sheet.pdf` / `oauth-cheat-sheet.pdf` / `springboot-cheat-sheet.pdf`.
6. Figures live under `modules/ROOT/images/` named `ddd-*.svg` (matching the `messaging-*.svg` /
   `oauth-*.svg` / `springboot-*.svg` convention), and every `[mermaid]` block must pass
   `npm run validate:mermaid` before the final build task.

The full page outline, book sources (Richardson's *Microservices Patterns*; Brown/Woolf/Yoder's *Cloud
Application Architecture Patterns*; Avram/Marinescu's *DDD Quickly*; Vernon's *DDD Destilado*), online-source
list, concept-to-book mapping table, and bibliography are already fully specified in the issue body — this plan
does not re-derive them, it sequences their creation into buildable, reviewable groups and adds the one thing
the issue leaves implicit: **a single canonical domain model every page's code examples must share**, so
`worked-example.adoc` can assemble them without divergence (see "Running domain model reference" below). None of
the four PDFs is uploaded or read verbatim into any page — only their publisher-page links and the
already-worked-out bibliography entries are used; every code example is written fresh against current Java 21 /
Spring Boot 4.1 and verified against the official documentation, not transcribed from the books' own
(Java 8/Spring Boot 2-era, or framework-specific) listings.

Nothing in the issue is ambiguous enough to need a user decision: it already names every file, every source URL,
every page's required content and figures, the disclaimer's reduced content, and the bibliography structure.
One design choice is made here, on the user's behalf, per this skill's Step 4 (stated so it can be challenged
during review): the domain-event hand-off style is **"aggregate methods return `List<DomainEvent>` to the
application service"** (Richardson's first, preferred option — see `Order`'s command methods below) rather than
the alternative "accumulate in an `AbstractAggregateRoot`" style; both are described in `domain-events.adoc`
(the issue asks for both to be shown), but the canonical running-domain code uses the return-value style
throughout, since it keeps the `Order` aggregate framework-free (no forced superclass), which better serves the
"plain Java 21 domain, Spring Boot 4.1 infrastructure" split the issue asks for.

No task below carries a language/framework tag: this repository has no installed `*-code-one-task` skill for
AsciiDoc/Antora documentation (only `iru-java-code-one-task`, `iru-java-springboot-code-one-task`,
`iru-dotnet-code-one-task` and `iru-database-code-one-task` are installed, per the same convention followed by
every prior plan in `.archive/` for this repository, e.g. `implementation_plan_150.md`). Every task here is a
direct AsciiDoc/Antora documentation edit.

## Current code state

This repository is the Antora playbook + `ROOT` component for https://albertoirurueta.github.io/docs. Relevant
existing structure:

- `modules/ROOT/nav.adoc` — the site nav; *Guides & References → Backend Development* currently ends with the
  Messaging block (`*** xref:backend/messaging/index.adoc[Messaging]` ... `**** xref:backend/messaging/cheat-sheet.adoc[Cheat Sheet (PDF)]`),
  itself preceded by the Quarkus Reference block.
- `modules/ROOT/pages/backend/index.adoc` — lists every Backend Development sibling section with a one-line
  description; the Messaging bullet is the most recently added, at the end of `== Sections`.
- `modules/ROOT/pages/index.adoc` — root landing page; its `:keywords:` line already lists `messaging, Apache
  Kafka, RabbitMQ, AMQP, message broker, event streaming, Spring AMQP, Spring Cloud Stream` from #150.
- `modules/ROOT/partials/messaging-disclaimer.adoc` — the exact template to follow for the new
  `ddd-microservices-disclaimer.adoc`: a bare `[IMPORTANT]`/`====` block with the AI-assistance sentence plus a
  `xref:....adoc#_bibliography[...]` pointer, nothing else.
- `modules/ROOT/pages/backend/springboot/architectural-patterns.adoc` (347 lines) — has an introductory "DDD
  vocabulary" block (entity/value object/aggregate/domain event in ~50 lines of Java, using `Order`/`OrderLine`/
  `Money`/`OrderPlaced`), one paragraph each on the transactional outbox and listen-to-yourself, and a
  choreography-vs-orchestration saga Mermaid diagram (`Order Service`/`Inventory Service`/`Payment Service`/
  `Shipping Service` — the same four bounded contexts this plan's canonical model reuses). Its closing section,
  `== Where this section stops`, literally says: *"A deeper, dedicated Architectural Patterns guide, with worked
  examples of each pattern end to end, is planned as a future addition to Backend Development."* — this plan
  updates that sentence to point at `xref:backend/ddd-microservices/index.adoc`.
- `modules/ROOT/pages/backend/messaging/messaging-patterns-in-practice.adoc` (314 lines) — already documents the
  **broker-level** realization of the outbox, saga choreography/orchestration, and event-sourcing/CQRS (Kafka
  topics, RabbitMQ exchanges, log compaction). The new pages must link here for transport mechanics and must not
  re-explain them.
- `modules/ROOT/pages/backend/messaging/spring-boot-other-messaging-options.adoc` — has a short paragraph on
  Spring application events / Spring Modulith; the new outbox page's Spring Modulith event-publication-registry
  coverage links here rather than repeating the basics.
- `modules/ROOT/pages/backend/quarkus/datasources-and-transactions.adoc` — has a `=== Sagas with Narayana LRA`
  subsection contrasting XA with LRA-based compensation; the new saga page links here as the Quarkus realization.
- `modules/ROOT/pages/database/choosing-the-right-database.adoc` — has a `<<Keeping Several Databases
  Consistent -- CQRS>>` anchor from the storage-selection angle; the new CQRS page links here.
- `modules/ROOT/pages/backend/hibernate/locking.adoc` — documents optimistic/pessimistic locking generally
  (including `@Version`); the new aggregates page links here for the underlying JPA mechanism.
- `modules/ROOT/pages/backend/springboot/api-first-messaging.adoc` and
  `modules/ROOT/pages/backend/springboot/api-first-rest-and-grpc.adoc` already use the package convention
  `com.example.orders.*` and an `OrderPlaced` type — this plan's canonical model reuses the same `com.example`
  root package family for consistency with the rest of the repository's Java examples.
- `modules/ROOT/attachments/messaging-cheat-sheet.pdf`, `oauth-cheat-sheet.pdf`, `springboot-cheat-sheet.pdf` —
  the visual precedent for the new cheat sheet: A4 portrait, one page, multi-column colour-coded boxes, header
  line, italic breadcrumb footer. None of their HTML/CSS sources survived in git history; `.archive/implementation_plan_150.md`
  (Task 35.1) records that the Messaging cheat sheet's visual style was reverse-engineered from the rendered PDF
  via PyMuPDF — the same approach applies here (inspect `messaging-cheat-sheet.pdf`, the most recent and closest
  in spirit, rather than starting from a blank layout).
- `scripts/validate-mermaid.mjs` / `npm run validate:mermaid` — validates every `[mermaid]` block in the repo;
  runs in CI and must pass before this plan's final task.
- Locally available tooling (confirmed during exploration): headless Chrome (`/Applications/Google Chrome.app`)
  and PyMuPDF (`python3 -c "import fitz"`) for producing and verifying the cheat-sheet PDF, matching the
  precedent's tooling exactly.
- `.archive/implementation_plan_150.md` (Messaging section, issue #150) is the direct structural precedent for
  this plan: disclaimer group first, content pages grouped 2–4 per group in outline order, landing+cheat-sheet
  page last among content (needs every other page's final title/path), a dedicated cheat-sheet-PDF group, a
  non-parallel site-wiring group, a parallel cross-links group, and a final Mermaid-validation + build-verify
  group.

### Running domain model reference (canonical across every page — new, defined here)

Every code example in every page below must use **these exact names and shapes** unless a task explicitly says
otherwise, so `worked-example.adoc` (Task 25) can assemble every prior page's code into one coherent flow without
rewriting it. Four bounded contexts, matching `architectural-patterns.adoc`'s existing saga diagram: **Order**,
**Inventory**, **Payment**, **Shipping** (plus **Customer** as a generic subdomain, referenced only by
`CustomerId`, never implemented). Root package family: `com.example` (matching `api-first-messaging.adoc` /
`api-first-rest-and-grpc.adoc`'s existing `com.example.orders.*` convention).

**Shared value objects/identities** (`com.example.shared`):
```java
public record CustomerId(UUID value) { public static CustomerId generate() { return new CustomerId(UUID.randomUUID()); } }
public record ProductId(UUID value) { }
public record Money(BigDecimal amount, Currency currency) {
    public Money add(Money other) { requireSameCurrency(other); return new Money(amount.add(other.amount), currency); }
    public Money multiply(int factor) { return new Money(amount.multiply(BigDecimal.valueOf(factor)), currency); }
}
public record Address(String street, String city, String postalCode, String country) { }
```

**Shared domain-event envelope** (`com.example.shared.event`):
```java
public interface DomainEvent { Instant occurredOn(); }
public record DomainEventEnvelope<T extends DomainEvent>(
        String eventId, String aggregateType, String aggregateId,
        String causationId, String correlationId, T event) { }
```

**Order aggregate** (`com.example.order.domain`) — the aggregate root most pages center their examples on:
```java
public record OrderId(UUID value) { public static OrderId generate() { return new OrderId(UUID.randomUUID()); } }
public record OrderLine(ProductId productId, int quantity, Money unitPrice) {
    public Money lineTotal() { return unitPrice.multiply(quantity); }
}
public enum OrderStatus { APPROVAL_PENDING, APPROVED, REJECTED, CANCELLED }

public class Order {
    private final OrderId id;
    private final CustomerId customerId;
    private final List<OrderLine> lines;
    private OrderStatus status;
    private long version; // optimistic lock

    public static List<DomainEvent> place(Order[] out, PlaceOrderCommand command) { /* factory, see below */ }
    public static Order place(PlaceOrderCommand command) { /* returns new Order in APPROVAL_PENDING */ }
    public List<DomainEvent> approve() { /* APPROVAL_PENDING -> APPROVED, returns List.of(new OrderApproved(...)) */ }
    public List<DomainEvent> reject(String reason) { /* -> REJECTED, returns List.of(new OrderRejected(...)) */ }
    public List<DomainEvent> cancel() { /* -> CANCELLED, returns List.of(new OrderCancelled(...)) */ }
    public Money totalAmount() { return lines.stream().map(OrderLine::lineTotal).reduce(Money::add).orElseThrow(); }
}
```
(Pages must resolve the two `place` sketches above into one real signature — the intent is: a static factory
`Order.place(PlaceOrderCommand command)` returns the new `Order`, and the caller retrieves its pending events via
a **second** value the factory also produces; simplest is `Order.place(...)` returning the `Order` and the order
having *already* recorded `OrderPlaced` internally for the caller to read via a `pullEvents()`-style method
**or**, preferred per the Task-summary decision above, a small `record OrderCreation(Order order, List<DomainEvent>
events)` return type from the factory. Pick the return-value style consistently in `entities.adoc`/`aggregates.adoc`
and reuse it verbatim afterward — do not invent a second style later.)

**Order domain events** (`com.example.order.domain.event`, each `implements DomainEvent`):
`OrderPlaced(OrderId orderId, CustomerId customerId, List<OrderLine> lines, Money totalAmount, Instant occurredOn)`,
`OrderApproved(OrderId orderId, Instant occurredOn)`,
`OrderRejected(OrderId orderId, String reason, Instant occurredOn)`,
`OrderCancelled(OrderId orderId, Instant occurredOn)`.

**Order repository/application/infrastructure**:
- `com.example.order.domain.OrderRepository` — `Order findById(OrderId id); void save(Order order);`
- `com.example.order.application.PlaceOrderCommand(CustomerId customerId, List<OrderLine> lines)` and
  `PlaceOrderService` (`@Transactional`, loads/saves via `OrderRepository`, publishes the returned events)
- `com.example.order.infrastructure` — Spring Data JPA mapping of `Order` (`@Entity`, `OrderId` via
  `@EmbeddedId` or an `AttributeConverter<OrderId, UUID>`, `OrderLine` as `@ElementCollection` of an
  `@Embeddable`, `@Version` on a `long version` field for optimistic locking).

**Saga participants and messages** (`com.example.inventory`, `com.example.payment`, `com.example.shipping`,
saga types in `com.example.order.saga`) — the *Place Order Saga*: reserve inventory (compensatable) → authorize
payment (pivot) → schedule shipping (retriable) → approve order:
```java
// Inventory (compensatable step)
record ReserveInventoryCommand(OrderId orderId, List<OrderLine> lines) { }
record InventoryReserved(OrderId orderId) { }
record InventoryReservationFailed(OrderId orderId, String reason) { }
record ReleaseInventoryCommand(OrderId orderId) { } // compensation

// Payment (pivot step — no compensation modeled)
record AuthorizePaymentCommand(OrderId orderId, CustomerId customerId, Money amount) { }
record PaymentAuthorized(OrderId orderId) { }
record PaymentAuthorizationFailed(OrderId orderId, String reason) { }

// Shipping (retriable step)
record ScheduleShippingCommand(OrderId orderId, Address address) { }
record ShippingScheduled(OrderId orderId) { }

record ApproveOrderCommand(OrderId orderId) { }
record RejectOrderCommand(OrderId orderId, String reason) { }
```
Saga orchestrator: `PlaceOrderSaga` modeled as a state machine with states `RESERVING_INVENTORY →
AUTHORIZING_PAYMENT → SCHEDULING_SHIPPING → ORDER_APPROVED` (happy path); on inventory failure →
`ORDER_REJECTED` directly (nothing to compensate yet); on payment failure → `REJECTING_INVENTORY` (compensates
by releasing inventory) → `ORDER_REJECTED`.

**Event-sourced variant** (`event-sourcing.adoc` only, reusing the same `Order*` event types): an
`EventSourcedOrder` with `decide(Command)`/`apply(DomainEvent)` split, and:
```java
public interface EventStore {
    void append(String streamId, long expectedVersion, List<DomainEvent> events);
    List<DomainEvent> load(String streamId);
}
```

**CQRS view** (`cqrs.adoc`, reused by `worked-example.adoc`): `OrderHistoryView` (a flat read-model
record/table row), `OrderHistoryProjector` (`@KafkaListener`-style event handler with an idempotent upsert), and
`OrderHistoryQueryService` (a query-only REST endpoint).

**Outbox schema** (`transactional-outbox.adoc`): an `outbox` table — `id`, `aggregate_type`, `aggregate_id`,
`event_type`, `payload`, `headers`, `created_at`, `published_at` — written in the same local transaction as the
aggregate.

Every task below that adds Java code must reuse these exact type/method names; a task may *add* a
page-specific detail (e.g. a JUnit test, an extra field) but must not rename or reshape a type another page
already establishes.

## Implementation steps

### Group 1 — Disclaimer partial (Parallelizable: yes)

Must land before any page, since every page includes it.

- [x] Task 1. Create `modules/ROOT/partials/ddd-microservices-disclaimer.adoc` — created, matching
      `messaging-disclaimer.adoc`'s template exactly (AsciiDoc-only edit; no tests/coverage/quality tooling
      applies to this docs repository).
  - [x] Task 1.1. Write a single `[IMPORTANT]`/`====` block containing **only**: (a) the standard AI-assistance
        disclosure sentence ("This content was generated with the assistance of AI and should be verified
        against the official documentation before being relied on in production."); (b) a pointer to
        `xref:backend/ddd-microservices/index.adoc#_bibliography[the section bibliography]`. No version-baseline
        sentence, no book title, no evaluation paragraph.
  - [x] Task 1.2. Keep the two sentences readable as one short paragraph inside the admonition, matching
        `messaging-disclaimer.adoc`'s exact phrasing style.

### Group 2 — Strategic and structural foundations (Parallelizable: yes)

- [x] Task 2. `strategic-design.adoc` — "Strategic Design for Microservices" — created (317 lines), all sub-tasks
      below complete. No tests/coverage/quality/license tooling applies to this docs repository.
  - [x] Task 2.1. Domain vs. subdomain types (core/supporting/generic) and the ubiquitous language; the bounded
        context as the unit that owns a model **and a database** — the bridge from strategic DDD to "database
        per service"; decomposition by subdomain vs. by business capability (Richardson ch. 2).
  - [x] Task 2.2. The context map and its relationship patterns: partnership, shared kernel, customer–supplier,
        conformist, anticorruption layer, open host service/published language, separate ways, big ball of mud
        — one short definition each, plus which of them meaningfully change once the boundary is a network call
        instead of an in-process reference.
  - [x] Task 2.3. The three integration styles between contexts (RPC, REST, messaging — Vernon ch. 4) and why
        messaging is the one the rest of the section builds on.
  - [x] Task 2.4. Code: an anticorruption-layer adapter class translating another bounded context's DTO (e.g. a
        `CatalogProductDto`) into the local `ProductId`/value-object shape, using the canonical types from
        "Running domain model reference".
  - [x] Task 2.5. Add: SVG context map of the running domain — Order, Inventory, Payment, Shipping, plus the
        Customer generic subdomain (`ddd-context-map.svg`, created); mermaid of the subdomain-to-service mapping
        (passes `npm run validate:mermaid`).
  - [x] Task 2.6. `== References` linking microservices.io (Decompose by Subdomain / by Business Capability),
        Martin Fowler's Bounded Context article, and the Domain Language DDD Reference.

- [x] Task 3. `structuring-the-code.adoc` — "Structuring a DDD Microservice's Code" — created (219 lines), all
      sub-tasks below complete. No tests/coverage/quality/license tooling applies to this docs repository.
  - [x] Task 3.1. Transaction script vs. domain model and when each is right (Richardson 5.1); the layered
        architecture (interface/application/domain/infrastructure) restated briefly, linking
        `xref:backend/springboot/architectural-patterns.adoc#_hexagonal_ports_and_adapters_architecture[the
        hexagonal-architecture explanation]` (anchor verified against the target page's heading) rather than
        re-explaining ports and adapters.
  - [x] Task 3.2. Application services as the transaction boundary: loads exactly one aggregate, invokes it,
        saves it, publishes its events; inbound adapters (REST controller, saga command handler, event
        consumer) and outbound adapters (repository implementation, event publisher).
  - [x] Task 3.3. The Maven module / Java package layout using the canonical `com.example.order.{domain,
        application,infrastructure,api}` packages; what goes into a DTO vs. a command vs. an event; a one-line
        mention of Spring Modulith's `@ApplicationModule` as the framework-level enforcement of this layout
        (linking `spring-boot-other-messaging-options.adoc`'s Spring Modulith paragraph, not repeating it).
  - [x] Task 3.4. Code: the complete `PlaceOrderService` application service (`@Transactional`, `OrderRepository`
        + a `DomainEventPublisher`-shaped dependency) and the `PlaceOrderCommand` record from the canonical
        model, plus the package tree as a fenced block.
  - [x] Task 3.5. Add: SVG of the hexagon with the running example's concrete classes in each port/adapter
        slot (`ddd-hexagon-order-service.svg`, created).
  - [x] Task 3.6. `== References` linking Alistair Cockburn's Hexagonal Architecture article and the Microsoft
        Learn "apply simplified CQRS and DDD patterns" / domain-model page.

### Group 3 — Tactical building blocks (Parallelizable: yes)

- [x] Task 4. `entities.adoc` — "Entities"
  - [x] Task 4.1. Identity as the defining property — what "the same order" means across time and
        representations; identity vs. reference equality; how identities are created (generated UUID, database
        sequence, natural key, user-supplied code) and why client-generated identity helps idempotency/event
        correlation later.
  - [x] Task 4.2. Rich behavior instead of getters/setters; invariants enforced in methods; a state machine
        inside an entity (`OrderStatus` transitions); `equals`/`hashCode` on identity only.
  - [x] Task 4.3. JPA mapping with a typed identifier (an `AttributeConverter<OrderId, UUID>` or `@EmbeddedId`).
  - [x] Task 4.4. Code: the canonical `Order` entity (identity + `place`/`approve`/`reject`/`cancel`), its JPA
        mapping, and a JUnit 5 test asserting `equals` is identity-based even when other fields differ.
  - [x] Task 4.5. Add: 📊 mermaid state diagram of the `OrderStatus` lifecycle (`ddd-order-lifecycle.svg` or an
        inline `[mermaid]` block — mermaid preferred here since it's a state diagram, not an SVG).
  - [x] Task 4.6. `== References` linking the Domain Language DDD Reference's entity section and Martin
        Fowler's relevant bliki entry if one exists (else DDD Quickly's/Vernon's canonical definition is cited
        in the bibliography, not as an online reference here — every `== References` link must be reachable
        online).

- [x] Task 5. `value-objects.adoc` — "Value Objects"
  - [x] Task 5.1. No identity, equality by attributes, immutability, self-validation in the constructor,
        side-effect-free operations returning new instances, safe sharing, "keep them thin".
  - [x] Task 5.2. When to promote a primitive to a value object (`Money`, `Address`, `Quantity`, typed IDs) and
        when not to; Java `record` as the natural implementation; sealed interfaces for closed sets.
  - [x] Task 5.3. Persistence: `@Embeddable`/`@Embedded`, `@ElementCollection`, JSON columns, attribute
        converters for a typed ID used as a value object (cross-reference Task 4's `OrderId` converter).
  - [x] Task 5.4. Code: the canonical `Money` record (`add`, `multiply`, currency-mismatch validation), the
        `Address` record, the `@Embeddable` mapping for `OrderLine`, and a test asserting value equality.
  - [x] Task 5.5. Add: 📊 SVG contrasting entity identity with value equality (`ddd-entity-vs-value-object.svg`).
  - [x] Task 5.6. `== References` linking Martin Fowler's ValueObject bliki entry and the Domain Language DDD
        Reference's value-object section.

- [x] Task 6. `aggregates.adoc` — "Aggregates"
  - [x] Task 6.1. The problem of fuzzy boundaries: the concurrent-line-item-update example (two users each
        independently satisfy the order minimum, but the merged result violates it) from Richardson 5.2.1,
        restated with the canonical `Order`/`OrderLine`.
  - [x] Task 6.2. The aggregate as a cluster of entities/value objects with one root and an explicit boundary;
        **the rules**, reconciled in one table across Richardson's three and Vernon's four: only the root is
        referenced from outside; other aggregates are referenced by identity, never by object reference; one
        transaction creates or updates exactly one aggregate; protect true business invariants inside the
        boundary and nothing else; keep aggregates small.
  - [x] Task 6.3. Aggregate granularity trade-offs (Order nested inside Customer vs. kept separate) and why
        smaller wins for microservices specifically (Richardson 5.2.4).
  - [x] Task 6.4. Optimistic locking on the root with `@Version` (link `xref:backend/hibernate/locking.adoc[]`
        rather than re-explaining JPA locking); loading/saving whole aggregates, no lazy-loading surprises;
        cross-aggregate consistency is eventual, via domain events — explicitly forward-reference
        `domain-events.adoc` and `sagas.adoc` here as "how eventual consistency is actually implemented".
  - [x] Task 6.5. Designing aggregates from event storming (one-paragraph forward reference to
        `event-storming.adoc`).
  - [x] Task 6.6. Code: the canonical `Order` aggregate root with `OrderLine` value objects enforcing the
        minimum-order invariant in a line-mutation method, `CustomerId`/`ProductId` references, `@Version`, and
        the repository call inside `PlaceOrderService`.
  - [x] Task 6.7. Add: 📊 SVG of the running domain's four aggregates with their boundaries and cross-aggregate
        identity references (`ddd-aggregate-boundaries.svg`); 📊 mermaid sequence of two concurrent updates
        colliding on the version (the fuzzy-boundary scenario, resolved this time by `@Version`).
  - [x] Task 6.8. `== References` linking microservices.io's Aggregate pattern page and Martin Fowler's
        DDD_Aggregate bliki entry.

- [x] Task 7. `repositories-factories-and-domain-services.adoc` — "Repositories, Factories, and Domain Services"
  - [x] Task 7.1. Repositories: one per aggregate root, collection-like interface in the domain layer,
        implementation in infrastructure, no repository for non-root entities, query methods returning whole
        aggregates; Spring Data JPA mapping and the in-memory test double.
  - [x] Task 7.2. Factories: when a constructor is not enough (invariants spanning several objects,
        reconstitution vs. creation, hiding concrete types); static factory methods vs. factory classes —
        `Order.place(...)` as the running example's factory.
  - [x] Task 7.3. Domain services vs. application services: stateless domain logic that belongs to no entity
        (e.g. a pricing/allocation policy) vs. the use-case orchestrator; why neither holds state.
  - [x] Task 7.4. Modules as the last building block, in one paragraph (package-level cohesion, already shown
        as the `com.example.order.*` layout in Task 3).
  - [x] Task 7.5. Code: `OrderRepository` domain interface + a Spring Data JPA implementation, the `Order.place(...)`
        factory (reused, not redefined, from Tasks 4/6), and a `PricingService` domain service injected into
        `PlaceOrderService`.
  - [x] Task 7.6. Add: 📊 SVG of the building blocks and the arrows allowed between them (entity/value
        object/aggregate/repository/factory/domain service/application service) (`ddd-building-blocks.svg`).
  - [x] Task 7.7. `== References` linking microservices.io's Aggregate page (repository is discussed there too),
        Spring Data JPA's repository reference, and Martin Fowler's Repository bliki entry if reachable.

### Group 4 — Why not distributed transactions, and sagas (Parallelizable: yes)

- [x] Task 8. `why-not-distributed-transactions.adoc` -- created (385 lines), with ddd-availability-product.svg
      and a 2PC mermaid sequence. "Why Distributed Transactions Don't Work Across
      Microservices"
  - [x] Task 8.1. Database per service / self-managed data stores and why a shared database of record couples
        services (schema evolution, locking, single point of failure) — Brown/Woolf/Yoder's *Self-Managed Data
        Stores* pattern.
  - [x] Task 8.2. What local ACID gives a monolith and why it stops at the service boundary; the traditional
        answer — X/Open XA and two-phase commit — stated precisely (prepare phase, commit phase, coordinator).
  - [x] Task 8.3. The four concrete problems in a microservice architecture: (a) unsupported by most NoSQL
        stores and by modern brokers such as Kafka and RabbitMQ; (b) availability is the **product** of the
        participants' availability (two 99.5% services → 99%, worked as an actual multiplication); (c) locks
        held across the network for the whole prepare/commit window; (d) CAP — consistency, availability, and
        partition tolerance cannot all hold, and the cloud chooses availability ("the cloud is rather
        inhospitable for performing transactions": restarts, relocation, retries — Brown/Woolf/Yoder's
        *Service Orchestrator* motivation).
  - [x] Task 8.4. The "not even Starbucks uses two-phase commit" argument (Hohpe), stated as a citation, not
        reproduced at length (copyright: summarize the argument, link the essay, do not quote more than one
        short phrase).
  - [x] Task 8.5. The consequence: **one transaction, one aggregate, one service**, and eventual consistency
        everywhere else (forward-reference `aggregates.adoc` rule #3 and `domain-events.adoc`); the three
        strategies for a multi-step task without a distributed transaction (Brown/Woolf/Yoder's *Service
        Orchestrator*): read-only/idempotent orchestration, consolidating into one service, a coordinated
        business process with compensations — i.e., a saga (forward-reference `sagas.adoc`); the local XA/LRA
        options that still exist within one runtime, linking
        `xref:backend/quarkus/datasources-and-transactions.adoc[]`'s Narayana LRA subsection.
  - [x] Task 8.6. A decision table: "when you think you need a distributed transaction" → which of the four
        outcomes (single aggregate/service, read-only composition, consolidation, saga) actually applies.
  - [x] Task 8.7. Code: the same `checkout` operation written naively with one `@Transactional` spanning two
        REST calls to Inventory and Payment services, annotated inline with what fails at each step, then
        restructured as `PlaceOrderService`'s single local transaction plus an outbox event (forward-reference
        to `transactional-outbox.adoc` for the outbox mechanics, not repeated here).
  - [x] Task 8.8. Add: 📊 mermaid sequence of 2PC with the coordinator-crash window highlighted; 📊 SVG of the
        availability-product arithmetic (`ddd-availability-product.svg`).
  - [x] Task 8.9. `== References` linking X/Open XA (Wikipedia), the CAP theorem (Wikipedia), the Starbucks
        two-phase-commit essay, and microservices.io's Database-per-Service pattern page.

- [x] Task 9. `sagas.adoc` — created (547 lines), with `ddd-saga-steps.svg`, a `PlaceOrderSaga` state-diagram
      mermaid block, and a failure-path sequence mermaid block.
  - [x] Task 9.1. A saga as a message-driven sequence of local transactions (ACD, not ACID); the running *Place
        Order Saga* (reserve inventory → authorize payment → schedule shipping → approve order) and its failure
        path, using the canonical saga commands/replies.
  - [x] Task 9.2. Compensating transactions (`T1…Tn, Cn…C1`); which steps need one and which do not; the saga
        structure — **compensatable, pivot, and retriable** transactions, mapped onto the three canonical saga
        steps (reserve inventory = compensatable, authorize payment = pivot, schedule shipping = retriable).
  - [x] Task 9.3. **Choreography**: participants react to each other's events; correlation IDs; benefits
        (simplicity, loose coupling) and drawbacks (harder to see the whole flow, cyclic dependencies, risk of
        tight coupling). **Orchestration**: a `PlaceOrderSaga` orchestrator sends commands and consumes replies,
        modeled as the canonical state machine; keeps participants/aggregates simpler; the "smart orchestrator,
        dumb services" risk. State the recommendation to orchestrate all but the simplest sagas.
  - [x] Task 9.4. Sagas are **ACD** — the lack of isolation and its anomalies (lost update, dirty read, fuzzy
        read), each with a short concrete example reusing the running domain (e.g. a `CancelOrderSaga` refunding
        credit racing the `PlaceOrderSaga`).
  - [x] Task 9.5. The six **countermeasures**: semantic lock (the `Order.status` `*_PENDING` states already
        used by the canonical model), commutative updates, pessimistic view, reread value, version file, by
        value — one paragraph each, grounded in the running domain wherever it fits naturally.
  - [x] Task 9.6. Transactional messaging as a prerequisite (forward-reference `transactional-outbox.adoc`); the
        orchestrator's own persistence and recovery; saga participants as idempotent command handlers; testing a
        saga as a state machine (given-state/when-reply/then-transition).
  - [x] Task 9.7. Where durable-execution engines and libraries fit, named with links, none required: Temporal,
        Camunda, Eventuate Tram Sagas, Axon sagas, Narayana LRA (cross-reference Task 8.5's link).
  - [x] Task 9.8. Code: the `PlaceOrderSaga` orchestrator as a state machine (a sealed interface or enum-backed
        `SagaState`) with a persisted `SagaState` entity, the canonical command/reply records, an
        `InventoryService` command handler plus its `release` compensation, the `Order` semantic-lock states,
        and a short choreography-style variant of just the first two steps (Order publishes `OrderPlaced` →
        Inventory reacts) for contrast.
  - [x] Task 9.9. Add: 📊 mermaid state diagram of the `PlaceOrderSaga`; 📊 mermaid sequence of the failure path
        with the inventory-release compensation; 📊 SVG of compensatable/pivot/retriable steps mapped onto the
        three saga participants (`ddd-saga-steps.svg`).
  - [x] Task 9.10. `== References` linking microservices.io's Saga pattern page, the Microsoft Learn Saga
        reference architecture and Compensating Transaction pattern pages, and the Garcia-Molina & Salem Sagas
        (1987) paper PDF (the source of the compensatable/pivot/retriable structure Richardson and this page
        build on).

### Group 5 — Domain events and event storming (Parallelizable: yes)

- [x] Task 10. `domain-events.adoc` — "Domain Events" — created (395 lines); mermaid validation passes;
      forward xrefs to not-yet-created sibling pages (`index.adoc#_bibliography`, `transactional-outbox.adoc`,
      `listen-to-yourself.adoc`, `event-sourcing.adoc`) are expected at this point in the plan, matching every
      other already-created sibling page, and resolve once those groups land.
  - [x] Task 10.1. What a domain event is: a past-tense fact about an aggregate (`OrderPlaced`, not
        `PlaceOrder`); event vs. command (a command can be rejected, an event cannot — Vernon ch. 6); event
        naming (past-participle verbs) and properties (the causing command's data, plus metadata: event ID,
        timestamp, aggregate type/ID, causation ID, correlation ID); the envelope, reusing the canonical
        `DomainEventEnvelope`.
  - [x] Task 10.2. Minimal vs. **enriched** events and the stability trade-off (Richardson 5.3.3); time-based
        events (a deadline expiring is a fact, not a rejectable command — Vernon ch. 6).
  - [x] Task 10.3. How the aggregate hands events to the application service — present **both** styles named in
        the Task-summary decision: (a) methods return `List<DomainEvent>` (the style this section's canonical
        code uses throughout) and (b) accumulate-in-the-root via Spring Data's `AbstractAggregateRoot` +
        `@DomainEvents`/`@AfterDomainEventPublication`; state explicitly which one the rest of this section uses
        and why (framework-free domain layer).
  - [x] Task 10.4. In-process listeners (`@TransactionalEventListener`) vs. out-of-process publication; Spring
        Modulith's `@ApplicationModuleListener` as the module-scoped equivalent, linked rather than re-taught.
  - [x] Task 10.5. Consuming events: dispatch to handlers, idempotent handlers or processed-message tracking,
        ordering/causality per aggregate key; why the publishing context may subscribe to its own events
        (one-paragraph forward-reference to `listen-to-yourself.adoc` and to `aggregates.adoc`'s eventual
        consistency between aggregates); versioning events (never delete a field's meaning, add new event types
        instead — cross-reference `event-sourcing.adoc`'s "evolving events" for the deeper treatment).
  - [x] Task 10.6. Code: the canonical `DomainEvent` marker interface and `OrderPlaced` record, the envelope
        record, `Order.place(...)` returning its event, a Spring Data `AbstractAggregateRoot`-style alternative
        sketch (for contrast only, not reused elsewhere), a `@TransactionalEventListener` example, and an
        idempotent event handler backed by a `processed_events` table.
  - [x] Task 10.7. Added `modules/ROOT/images/ddd-event-envelope.svg` (📊 SVG of the event envelope with every
        metadata field labeled) and the 📊 mermaid sequence from command to published event (passes
        `npm run validate:mermaid`).
  - [x] Task 10.8. `== References` linking microservices.io's Domain Event pattern page, Martin Fowler's
        DomainEvent article, the Microsoft Learn domain-events-design-implementation page (verified reachable),
        and Spring Data's core-domain-events reference.

- [x] Task 11. `event-storming.adoc` — "Event Storming" — created (~200 lines); mermaid validation passes (no
      diagrams on this page); one forward xref to not-yet-created `cqrs.adoc` and to `index.adoc#_bibliography`,
      expected at this point in the plan like every other already-created sibling page.
  - [x] Task 11.1. The workshop that discovers the model: big-picture, process, and design-level sessions.
  - [x] Task 11.2. The sticky-note grammar (domain events — orange, commands — blue, actors, aggregates —
        yellow, policies, read models, external systems — pink/purple, hot spots) and the three steps: brainstorm
        events → identify triggers (user action/command, external system, another event, passing of time) →
        identify the aggregate that consumes each command and emits the event (Richardson 5.3.4).
  - [x] Task 11.3. How the result maps onto bounded contexts, aggregates, domain events, and sagas; running it
        remotely; what to do after the workshop (feeding the board into the strategic-design and aggregate work
        already covered).
  - [x] Task 11.4. No code example included on this page (facilitation technique, not a programming structure) —
        the running domain's event-storming board is reproduced as a figure, with a table listing the
        aggregates/commands/events the later pages implement.
  - [x] Task 11.5. Added `modules/ROOT/images/ddd-event-storming-board.svg` (📊 SVG of the event-storming board
        for the running domain — orange event stickies `OrderPlaced`, `InventoryReserved`, `PaymentAuthorized`,
        `ShipmentScheduled`, `OrderApproved`; blue command stickies; yellow aggregate stickies `Order`,
        `Inventory`, `Payment`, `Shipping`).
  - [x] Task 11.6. `== References` linking eventstorming.com (Alberto Brandolini). No Domain Language or
        Microsoft Learn page could be verified to actually mention event storming as a discovery technique
        (checked domainlanguage.com's DDD reference and search, and the two most relevant Microsoft Learn
        microservice-boundary pages) — per the task's own "if reachable" qualifier, that second link is omitted
        rather than added unverified.

### Group 6 — Transactional outbox and listen to yourself (Parallelizable: yes)

- [x] Task 12. `transactional-outbox.adoc` — "The Transactional Outbox Pattern" — created (421 lines), reusing
      `Order`/`OrderPlaced`/`DomainEventEnvelope`/`PlaceOrderService`/`OrderRepository` verbatim; not applicable:
      tests/coverage/lint/license headers (docs-only repository).
  - [x] Task 12.1. The dual-write problem stated precisely: commit-then-crash-before-publish, and
        publish-then-roll-back; why a distributed transaction across database and broker is not the fix (link
        back to `why-not-distributed-transactions.adoc`).
  - [x] Task 12.2. The outbox table (the canonical schema: id, aggregate_type, aggregate_id, event_type,
        payload, headers, created_at, published_at) written in the *same* local transaction as the aggregate.
  - [x] Task 12.3. The polling publisher (query unpublished rows, publish, mark/delete; batch size, ordering by
        aggregate key, at-least-once and the duplicates it implies) and transaction-log tailing / CDC (Debezium's
        outbox event router), linking `xref:backend/messaging/kafka-connect.adoc[]` rather than repeating its
        configuration.
  - [x] Task 12.4. The NoSQL variant (events embedded in the aggregate document) in one paragraph; Spring
        Modulith's **event publication registry** as an outbox built into the framework (completion tracking,
        republishing incomplete publications, externalizing to Kafka/AMQP), linking
        `xref:backend/messaging/spring-boot-other-messaging-options.adoc[]`'s Spring Modulith paragraph.
  - [x] Task 12.5. The idempotent consumer on the receiving side (dedup table, natural idempotency); operational
        concerns: outbox growth/cleanup, ordering per partition key, monitoring lag.
  - [x] Task 12.6. Code: the outbox DDL, an `OutboxEventPublisher` used by `PlaceOrderService` inside its
        `@Transactional` method, a `@Scheduled` polling relay using `KafkaTemplate`, the Spring Modulith
        externalized-event configuration sketch, and a consumer using `INSERT ... ON CONFLICT DO NOTHING`
        deduplication.
  - [x] Task 12.7. Add: 📊 mermaid sequence of the outbox flow (write + outbox insert → relay → broker →
        consumer); 📊 SVG of polling vs. log tailing (`ddd-outbox-polling-vs-tailing.svg`) — both added;
        `npm run validate:mermaid` passes (308/308 diagrams).
  - [x] Task 12.8. `== References` linking microservices.io's Transactional Outbox and Polling Publisher pattern
        pages, Debezium's outbox event router docs, and Spring Modulith's events reference.

- [x] Task 13. `listen-to-yourself.adoc` — "Listen to Yourself" — created (346 lines), reusing
      `Order`/`OrderPlaced`/`DomainEventEnvelope`/`PlaceOrderCommand` verbatim and `ProcessedEvent`/
      `ProcessedEventRepository` from `domain-events.adoc` for the self-consumer's dedup table; not applicable:
      tests/coverage/lint/license headers (docs-only repository).
  - [x] Task 13.1. The pattern stated precisely: the service publishes the event **first** (to the same topic
        other services read) and consumes its own event to apply the change to its own database, so there is
        exactly one code path reacting to "an order was placed."
  - [x] Task 13.2. What it costs: no read-your-writes (the HTTP response can only say "accepted"); a window in
        which the service's own state lags; ordering and idempotency requirements on the self-consumer; the
        event must be complete enough to reconstruct the write; validation must happen **before** publishing,
        since a published event cannot be rejected.
  - [x] Task 13.3. A side-by-side comparison with the outbox (no outbox table or relay needed, but no
        synchronous confirmation) and with event sourcing (the event here is transient — the database, not the
        event log, remains the source of truth).
  - [x] Task 13.4. When it fits (high write throughput, naturally asynchronous commands, replay/rebuild
        scenarios) and when it does not (strict invariants needing the current state, synchronous confirmation
        required); the DDD grounding — Vernon's rule 4 (a bounded context subscribing to the domain events it
        publishes itself).
  - [x] Task 13.5. Code: a `PlaceOrderController` returning `202 Accepted` after `KafkaTemplate.send(...)`, the
        `@KafkaListener` in the *same* service applying the event to the `Order` aggregate idempotently, and the
        same flow re-described in Spring Modulith terms (an `@ApplicationModuleListener` inside the same
        module).
  - [x] Task 13.6. Add: 📊 mermaid sequence contrasting the outbox flow (from Task 12.7) with listen-to-yourself
        side by side; 📊 SVG decision table (outbox vs. listen-to-yourself vs. plain synchronous call)
        (`ddd-listen-to-yourself-decision.svg`) — both added; `npm run validate:mermaid` passes.
  - [x] Task 13.7. `== References` linking Oded Shopen's original Medium article and Confluent Developer's
        "Listen to Yourself" course module — both already verified reachable.

### Group 7 — CQRS and event sourcing (Parallelizable: yes)

- [x] Task 14. `cqrs.adoc` — "CQRS" — created `modules/ROOT/pages/backend/ddd-microservices/cqrs.adoc` (~320
      lines), reusing the canonical `Order`/`OrderPlaced`/`OrderApproved`/`OrderRejected`/`OrderCancelled`/
      `DomainEvent`/`DomainEventEnvelope`/`PlaceOrderCommand` shapes verbatim. N/A: no tests/coverage/lint/license
      headers for this docs-only repository.
  - [x] Task 14.1. Why queries are hard once data is decomposed: the API-composition alternative and where it
        breaks (in-memory joins, filtering on attributes another service owns, consistency of composed
        results — Richardson 7.1); single-service queries the write model can't serve efficiently (search,
        geospatial, reporting) and the separation-of-concerns argument for a different service implementing the
        query than the one owning the data.
  - [x] Task 14.2. CQRS itself: command side (aggregates, publishes events) vs. query side (one or more read
        models updated by event handlers), within a service and as **query-only services**.
  - [x] Task 14.3. Designing a view module: choosing the view datastore for the actual queries; idempotent,
        concurrent-safe updates (event IDs, versions, upserts); building/rebuilding views from history; handling
        **replication lag** (return a version from the command, poll the view, update the client-side model
        optimistically).
  - [x] Task 14.4. Benefits (efficient multi-service queries, diverse query support, enables querying an
        event-sourced system, separation of concerns) and drawbacks (more moving parts, replication lag);
        link `xref:database/choosing-the-right-database.adoc#_keeping_several_databases_consistentcqrs[]`
        for the storage-selection angle rather than repeating it (anchor verified against the actual Asciidoctor-
        generated id via a direct `@asciidoctor/core` render — the em dash in the heading collapses the
        `consistent`/`cqrs` words together with no separating underscore, unlike a plain space).
  - [x] Task 14.5. Code: the canonical `OrderHistoryView` table/document, an `OrderHistoryProjector`
        (`@KafkaListener`-based, idempotent upsert keyed by event ID), the `OrderHistoryQueryService` REST
        endpoint, and a `PlacedOrderResponse` carrying a version field for lag handling.
  - [x] Task 14.6. Add: 📊 SVG of the command side, its events, and two read models fed from the same stream
        (`ddd-cqrs-command-and-query-sides.svg`); 📊 mermaid sequence of a write followed by a stale read and the
        client's version check — both validated (`npm run validate:mermaid` and a full `npx antora
        antora-playbook.yml` build render the page and figure correctly).
  - [x] Task 14.7. `== References` linking microservices.io's CQRS pattern page, Martin Fowler's CQRS bliki
        entry, and the Microsoft Learn CQRS pattern page.

- [x] Task 15. `event-sourcing.adoc` — "Event Sourcing" — created
      `modules/ROOT/pages/backend/ddd-microservices/event-sourcing.adoc` (~340 lines), reusing the canonical
      `Order*` event records verbatim in `EventSourcedOrder`'s `apply` method. N/A: no tests/coverage/lint/license
      headers for this docs-only repository.
  - [x] Task 15.1. The trouble with state-based persistence: no history, bolted-on audit, bolted-on event
        publication (Richardson 6.1.1).
  - [x] Task 15.2. Persisting an aggregate as its event stream in an event store (the canonical `EventStore`
        interface: `append(streamId, expectedVersion, events)` / `load(streamId)`); reconstituting state by
        replay — `fold(apply, events)`; structuring the aggregate as command methods that *decide* and `apply`
        methods that *mutate* (sealed event hierarchy + `switch` pattern matching in the `apply` method).
  - [x] Task 15.3. **Snapshots** (periodic state capture to bound replay cost); idempotent command handling and
        duplicate detection; **evolving events** — upcasting, versioned event types, never deleting a meaning
        (Vernon ch. 6, Richardson 6.1.2).
  - [x] Task 15.4. Benefits (audit trail, temporal queries, reliable event publication for free, testability via
        given/when/then) and drawbacks (learning curve, querying requires CQRS, event schema evolution, storage
        growth); event sourcing and sagas together in one paragraph (an event-sourced saga participant/
        orchestrator).
  - [x] Task 15.5. Frameworks and stores named with links, none required: Axon Framework, Eventuate,
        EventStoreDB/KurrentDB, or a plain SQL append-only table (the one this page's code example actually
        uses).
  - [x] Task 15.6. Code: the event-store DDL (an append-only events table keyed by stream ID + version), an
        `EventSourcedOrder` with `decide`/`apply` separated and reusing the canonical `Order*` event records,
        the `EventStore` interface and a SQL-backed implementation sketch, a snapshot record, and a JUnit
        "given events / when command / then events" test.
  - [x] Task 15.7. Add: 📊 SVG of the event stream vs. the traditional row (`ddd-event-stream-vs-row.svg`); 📊
        mermaid sequence of load → decide → append with a version conflict (optimistic concurrency on the
        stream) — both validated (`npm run validate:mermaid` and a full `npx antora antora-playbook.yml` build
        render the page and figure correctly).
  - [x] Task 15.8. `== References` linking microservices.io's Event Sourcing pattern page, Martin Fowler's
        EventSourcing article, and the Microsoft Learn Event Sourcing pattern page.

### Group 8 — Worked example (Parallelizable: yes — single task)

Depends on every page in Groups 3–7 existing with final code, since it assembles all of it.

- [x] Task 16. `worked-example.adoc` — "Putting It All Together: The Place Order Flow" — created
      `modules/ROOT/pages/backend/ddd-microservices/worked-example.adoc` (263 lines), assembling every sibling
      page's exact class/package names with no redefinitions; `npm run validate:mermaid` passed (312/312 diagrams,
      including this page's 2 new ones). N/A: tests/coverage/lint/license headers (docs-only repository).
  - [x] Task 16.1. Restate the full running domain (Order, Inventory, Payment, Shipping bounded contexts) and
        the complete package tree of the Order service assembled from every prior page's code
        (`com.example.order.{domain,application,infrastructure,api,saga}`, `com.example.shared`).
  - [x] Task 16.2. Walk the happy path end to end: `PlaceOrderController` → `PlaceOrderService` → `Order.place(...)`
        → outbox insert → relay → `PlaceOrderSaga` orchestrator → Inventory/Payment/Shipping command/reply
        exchanges → `Order.approve()` → `OrderHistoryProjector` updates the CQRS view.
  - [x] Task 16.3. Walk the payment-failure path: same flow through inventory reservation, then
        `PaymentAuthorizationFailed` → the saga's `REJECTING_INVENTORY` compensation → `Order.reject(...)` →
        the CQRS view reflecting `REJECTED`.
  - [x] Task 16.4. A checklist of what to test at each level: aggregate unit tests (`Order`), saga
        state-machine tests (`PlaceOrderSaga`), outbox/consumer idempotency tests, CQRS projection tests — each
        pointing back at the concrete test already sketched on its originating page rather than re-deriving it.
  - [x] Task 16.5. Add: 📊 SVG of the whole system (all four bounded contexts, the outbox, the saga orchestrator,
        the CQRS view) (`ddd-worked-example-system.svg`); 📊 mermaid sequence of the happy path; 📊 mermaid
        sequence of the payment-failure path.
  - [x] Task 16.6. `== References` — this page assembles prior pages' patterns rather than introducing new
        sources, so link back to the pattern-catalogue entries most central to the assembly (saga, outbox,
        CQRS, aggregate) rather than introducing new ones.

### Group 9 — Landing page and cheat-sheet page (Parallelizable: yes — both only read the finished state of Groups 1–8, neither touches the other's file)

- [x] Task 17. `index.adoc` — "DDD and Microservices" landing page — created
      `modules/ROOT/pages/backend/ddd-microservices/index.adoc` (header, disclaimer include, intro, "new here?"
      reading order, relationship paragraph, `== What's covered` grouped exactly per the issue outline, and
      `[[_bibliography]]` `== Bibliography`); no tests/coverage/lint/license applicable (docs-only repo).
  - [x] Task 17.1. One paragraph on what the section is about; the code baseline in prose (Java 21, Spring Boot
        4.1.x, Spring Data JPA, Spring Modulith 2.x, Spring for Apache Kafka 4.1.x).
  - [x] Task 17.2. A "new here? read in this order" pointer: strategic design → structuring the code → entities/
        value objects/aggregates/repositories → why not distributed transactions → sagas → domain events/event
        storming → outbox/listen-to-yourself → CQRS → event sourcing → the worked example.
  - [x] Task 17.3. The full "What's covered" list grouped exactly as the issue's page outline (Foundations;
        Tactical building blocks; Consistency across services; Putting it all together), each item an
        `xref:` to its page with a one-line description, plus a `cheat-sheet.adoc` line.
  - [x] Task 17.4. Relationship to the SpringBoot (architectural patterns, Spring Data), Messaging (patterns in
        practice, Kafka Connect), Quarkus (LRA), and Databases (choosing the right database) references — one
        short paragraph naming each with its xref.
  - [x] Task 17.5. `== Bibliography` section, grouped exactly as the issue specifies: pattern catalogues and
        canonical articles; framework documentation; consulted reference books (Richardson — Manning; Brown/
        Woolf/Yoder — O'Reilly; Avram/Marinescu — InfoQ free download; Vernon — InformIT for the English
        original plus Kalele for the Spanish translation site; Evans and Vernon's *Implementing DDD* named as
        further reading), each linked to its official/publisher page; close with the house-style note that the
        books are consulted references only and the pattern authors' current catalogues / framework docs are
        authoritative on any discrepancy.

- [x] Task 18. `cheat-sheet.adoc` — "DDD & Microservices Cheat Sheet" — created
      `modules/ROOT/pages/backend/ddd-microservices/cheat-sheet.adoc` (header, disclaimer include, intro
      paragraph, grouped xref lists to all 15 topic pages, `== Download` linking the not-yet-produced PDF); no
      tests/coverage/lint/license applicable (docs-only repo).
  - [x] Task 18.1. A short intro paragraph naming everything the sheet covers, cross-referencing every one of
        the 15 topic pages by `xref:`.
  - [x] Task 18.2. Link the PDF: `xref:attachment$ddd-microservices-cheat-sheet.pdf[Download the DDD &
        Microservices Cheat Sheet (PDF)]`.

### Group 10 — Cheat-sheet PDF (Parallelizable: yes — single task)

Depends on Group 9 (needs `cheat-sheet.adoc`'s finalized content list) and, for visual consistency, on
`messaging-cheat-sheet.pdf` existing as the style reference (it already does).

- [x] Task 19. Produce `modules/ROOT/attachments/ddd-microservices-cheat-sheet.pdf` — done: one A4 page
      (594.96×841.92pt), 12 colour-coded boxes across a 5-column layout, ~96% page-height fill, visually
      consistent with `messaging-cheat-sheet.pdf`. Tests/coverage/lint/license headers: not applicable (static
      PDF asset, no source code).
  - [x] Task 19.1. Inspect `messaging-cheat-sheet.pdf` directly with PyMuPDF (`fitz`) to extract its exact page
        size, column layout, palette RGB values, fonts, and border/header treatment — the same
        reverse-engineering approach `implementation_plan_150.md` Task 35.1 used, since no HTML/CSS source
        survives in git for any precedent cheat sheet. — done: `page.rect`/`get_fonts`/`get_drawings`/
        `get_text("dict")` on `messaging-cheat-sheet.pdf` confirmed A4 portrait (594.96×841.92pt), a 5-column
        flexbox-style layout, Helvetica Neue body/Menlo code fonts, thin (~1.1pt) colour-coded box borders with
        uppercase coloured headers (no fill bars), light hairline table row dividers, and a light-gray
        background for inline code tokens.
  - [x] Task 19.2. Build a print-ready HTML/CSS layout (multi-column flexbox, colour-coded bordered boxes with
        uppercase coloured headers, a header line with the code-baseline subtitle, an italic breadcrumb footer)
        as a scratch file (not committed to the repository). — done:
        `scratchpad/ddd-cheat-sheet.html` (5-column flexbox, 5-colour palette cycling blue/purple/teal/red/
        orange, header line with the Java 21 / Spring Boot 4.1.x / Spring Data JPA / Spring Modulith 2.x /
        Spring for Apache Kafka 4.1.x subtitle, italic breadcrumb footer), kept only in the session scratchpad.
  - [x] Task 19.3. Content, one box per group: the strategic vocabulary (domain/subdomain types, ubiquitous
        language, bounded context, context-map relationships); the building blocks table (entity/value
        object/aggregate/repository/factory/domain service/application service/domain event — definition,
        equality, mutability, where it lives); the aggregate rules; the "why not distributed transactions"
        one-liners (2PC/XA unsupported, availability product, locks, CAP → one aggregate per transaction,
        eventual consistency); the saga box (local transactions + compensations, compensatable/pivot/retriable,
        choreography vs. orchestration, the six countermeasures); the domain-event checklist (past tense,
        minimal vs. enriched, envelope fields, idempotent consumer); outbox vs. listen-to-yourself vs. event
        sourcing in a three-column comparison; the CQRS box; the event-sourcing box; the code-layout skeleton;
        the Spring mapping table. — done: all twelve boxes present (Strategic Vocabulary, Context-Map
        Relationships, Tactical Building Blocks, Aggregate Rules, Why Not Distributed Tx, Sagas, Domain-Event
        Checklist, Outbox/Listen-to-Yourself/Event Sourcing comparison, CQRS, Event Sourcing, Code-Layout
        Skeleton, Spring Mapping), wording drawn from the 17 finished pages under
        `modules/ROOT/pages/backend/ddd-microservices/`.
  - [x] Task 19.4. Render to PDF via headless Chrome (`Google Chrome --headless --print-to-pdf`), verify with
        PyMuPDF that the output is exactly one A4 page (594.96×841.92pt), iterating the layout (flexbox columns,
        `table-layout:fixed`, `hyphens:auto`, `<wbr>` in long tokens) rather than cropping or truncating content
        if it overflows. — done: rendered with `--headless --disable-gpu --no-pdf-header-footer
        --print-to-pdf`; first render overflowed a 5-column table beyond its box (table-layout:auto), fixed
        with `table-layout:fixed` + explicit `colgroup` widths and soft hyphens on long tokens; final PDF
        verified via PyMuPDF: `page_count == 1`, `page.rect` == 594.96×841.92pt. Visual check via
        `page.get_pixmap(dpi=110/300).save(...)` (both this PDF and `messaging-cheat-sheet.pdf` rendered to PNG
        for side-by-side comparison) confirmed no clipped/overlapping content and a consistent look (colour-coded
        bordered boxes, uppercase headers, hairline table dividers, ~96% page-height fill vs. the precedent's
        ~90%).
  - [x] Task 19.5. Check in only the rendered PDF at `modules/ROOT/attachments/ddd-microservices-cheat-sheet.pdf`;
        keep the scratch HTML/CSS source in the session scratchpad directory, not the repository. — done: PDF
        copied to `modules/ROOT/attachments/ddd-microservices-cheat-sheet.pdf`; HTML/CSS source and PNG
        previews left only under the session scratchpad directory.

### Group 11 — Site wiring (Parallelizable: no — small, order-sensitive edits across shared navigation/index files, matching the precedent's Group 15 treatment)

- [x] Task 20. `modules/ROOT/nav.adoc` — add the DDD and Microservices nav block — inserted the `***` entry plus
      its 15 concept-page `****` children and the cheat-sheet child right after the Messaging block; titles taken
      verbatim from each page's `= Title`; no tests/coverage/lint/license applicable (docs-only repo).
  - [x] Task 20.1. Insert `*** xref:backend/ddd-microservices/index.adoc[DDD and Microservices]` immediately
        after the Messaging block's last line (`**** xref:backend/messaging/cheat-sheet.adoc[Cheat Sheet
        (PDF)]`), before whatever nav entry currently follows the Messaging block.
  - [x] Task 20.2. Add the 15 concept-page `****` children plus the `****` cheat-sheet child, in the same order
        as Task 17.3's "What's covered" list.

- [x] Task 21. `modules/ROOT/pages/backend/index.adoc` — add the "DDD and Microservices" bullet — added the
      `== Sections` bullet after Messaging Reference and extended `:description:`/`:keywords:`; no
      tests/coverage/lint/license applicable (docs-only repo).
  - [x] Task 21.1. Add a new `* xref:backend/ddd-microservices/index.adoc[...]` bullet to `== Sections`, after
        the existing Messaging bullet, with a one-line description mentioning DDD, sagas, CQRS, and event
        sourcing.
  - [x] Task 21.2. Update the page's `:description:`/`:keywords:` to include the new section's terms.

- [x] Task 22. `modules/ROOT/pages/index.adoc` — root keywords — appended the new terms to the existing
      `:keywords:` line; no tests/coverage/lint/license applicable (docs-only repo).
  - [x] Task 22.1. Append `domain-driven design, DDD, microservices, saga, transactional outbox, CQRS, event
        sourcing, aggregate` to the existing `:keywords:` line.

### Group 12 — Reciprocal cross-links in existing pages (Parallelizable: yes — six distinct files)

- [x] Task 23. `backend/springboot/architectural-patterns.adoc`
  - [x] Task 23.1. Rewrite the `== Where this section stops` paragraph: replace "is planned as a future addition
        to Backend Development" with a link to `xref:backend/ddd-microservices/index.adoc[]` as the section that
        now provides that deeper treatment. — Done: sentence now reads "... `xref:backend/ddd-microservices/index.adoc[the
        DDD and Microservices section]` now provides that deeper treatment ...".
  - [x] Task 23.2. From the "Domain-driven design vocabulary", "The transactional outbox pattern", "Listen to
        yourself", and "The saga pattern" headings, add one short "for the full treatment, see …" sentence each,
        linking `entities.adoc`/`value-objects.adoc`/`aggregates.adoc`, `transactional-outbox.adoc`,
        `listen-to-yourself.adoc`, and `sagas.adoc` respectively. — Done: one sentence added under each of the four
        sections.

- [x] Task 24. `backend/messaging/messaging-patterns-in-practice.adoc`
  - [x] Task 24.1. From "Saga choreography vs. orchestration", add a link to `sagas.adoc` for the domain-model/
        consistency side. — Done.
  - [x] Task 24.2. From "Event sourcing, CQRS, and why log compaction matters", add links to `event-sourcing.adoc`
        and `cqrs.adoc`. — Done.
  - [x] Task 24.3. From "Transactional outbox and why dual writes fail", add a link to `transactional-outbox.adoc`.
        — Done.

- [x] Task 25. `backend/messaging/spring-boot-other-messaging-options.adoc`
  - [x] Task 25.1. From the Spring Modulith/application-events paragraph, add a link to
        `xref:backend/ddd-microservices/transactional-outbox.adoc[]`. — Done.

- [x] Task 26. `backend/quarkus/datasources-and-transactions.adoc`
  - [x] Task 26.1. From the "Sagas with Narayana LRA" subsection, add a link to
        `xref:backend/ddd-microservices/sagas.adoc[]`. — Done.

- [x] Task 27. `database/choosing-the-right-database.adoc`
  - [x] Task 27.1. From the CQRS section (`<<Keeping Several Databases Consistent -- CQRS>>`), add a link to
        `xref:backend/ddd-microservices/cqrs.adoc[]`. — Done.

- [x] Task 28. `backend/hibernate/locking.adoc`
  - [x] Task 28.1. From the optimistic-locking section, add a link to
        `xref:backend/ddd-microservices/aggregates.adoc[]` framed as "aggregate versioning." — Done: added under the
        `OPTIMISTIC_FORCE_INCREMENT` table, framed as "aggregate versioning."

### Group 13 — Mermaid validation and final build verification (Parallelizable: no — verifies the output of every prior group)

- [x] Task 29. Validate every Mermaid block added in Groups 2–9 — all 312 diagrams parse cleanly, no fixes needed.
  - [x] Task 29.1. Ran `npm run validate:mermaid`: "All 312 Mermaid diagrams parsed successfully." No blocks flagged.

- [x] Task 30. Build the site and verify — first build surfaced 2 attribute-reference warnings in this plan's own
      files, fixed by escaping literal `{id}`/`{orderId}` in prose (matching this repo's existing convention, e.g.
      `springboot/rest-apis.adoc`'s `\{id}`); rebuild is fully clean (exit 0, empty log).
  - [x] Task 30.1. Ran `npx antora antora-playbook.yml` (local content only, no `--fetch`), output redirected to a
        log file and grepped for `ERROR`/`WARN`/`xref`/`unresolved`/`include`/`image`/`attachment`/`ddd-`. First
        run: exit 0, but 2 `asciidoctor` warnings — `listen-to-yourself.adoc`: "skipping reference to missing
        attribute: id" (from `` `GET /orders/{id}` ``); `worked-example.adoc`: "skipping reference to missing
        attribute: orderid" (from `` `GET /order-history/{orderId}` ``). Both are under
        `modules/ROOT/pages/backend/ddd-microservices/`, so both were fixed by escaping the braces
        (`\{id}`, `\{orderId}`) — the same convention already used elsewhere in this repo (e.g.
        `backend/springboot/rest-apis.adoc:61`'s `` `/api/orders/\{id}` ``). Rebuilt after a clean `build/`
        removal: exit 0, log file empty, no matches for any of the grepped patterns. No pre-existing warnings from
        unrelated pages were present in either run.
  - [x] Task 30.2. `build/site/backend/ddd-microservices/` contains all 17 HTML pages (index, cheat-sheet, and the
        15 concept pages — verified by directory listing). `build/site/_attachments/ddd-microservices-cheat-sheet.pdf`
        exists. `modules/ROOT/images/ddd-*.svg` contains 14 files (the task text's own count, matching its
        parenthetical list of 14 named figures — the "17" in the task's opening clause bundles in the 2 HTML
        landing/cheat-sheet pages plus the pre-existing count confusion it flags for verification, not 17 SVGs);
        all 14 exist under `build/site/_images/`, each is referenced by exactly one page via `image::ddd-`, and
        every referenced image resolves. The built `index.html` nav contains the "DDD and Microservices" entry.
  - [x] Task 30.3. Every `xref:` target collected from `modules/ROOT/pages/backend/ddd-microservices/` resolves to
        an existing file under `modules/ROOT/pages/`; the 6 anchored cross-page xrefs
        (`messaging-patterns-in-practice.adoc#_event_sourcing_cqrs_and_why_log_compaction_matters`,
        `#_saga_choreography_vs_orchestration`,
        `spring-boot-other-messaging-options.adoc#_spring_modulith_externalizing_application_events_to_kafka_or_rabbitmq`,
        `datasources-and-transactions.adoc#_sagas_with_narayana_lra`,
        `architectural-patterns.adoc#_hexagonal_ports_and_adapters_architecture`,
        `choosing-the-right-database.adoc#_keeping_several_databases_consistentcqrs`) each have their `id="..."`
        anchor present exactly once in the corresponding built HTML page. The reciprocal `ddd-microservices` xrefs
        added in Group 12 to all six cross-linked pages were re-confirmed present. No broken xrefs found; no
        further fixes needed beyond the two escaping fixes in Task 30.1.
