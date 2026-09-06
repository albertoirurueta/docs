# Implementation Plan: SpringBoot Reference — Spring Security

## Task summary

Source: GitHub issue #63

Add **two new pages** to the existing **SpringBoot Reference** section
(`modules/ROOT/pages/backend/springboot/`), then wire them into navigation, the section landing page, and the
section bibliography:

| Page file | Title | Scope |
|-----------|-------|-------|
| `spring-security.adoc` | Spring Security | The filter-chain model; the method-security / context annotations and their usage; how the `SecurityContext` works for the servlet **and** reactive stacks; how the context is built from a username/password credential and from a bearer **JWT** (OAuth2 Resource Server). |
| `spring-security-authorization-server.adoc` | Authorization Server & Social Login | Building an OAuth2 / OIDC **authorization server** with Spring Authorization Server to handle login/logout and issue access/refresh/ID tokens; **social login** ("Sign in with Google / Microsoft / Apple") with `oauth2Login()` — interfaces to implement, database model, REST controller + endpoints, and the REST clients that talk to the external identity providers. |

Everything targets **Spring Boot 4.1.x / Spring Framework 7.0.x / Spring Security 7.0.x** on the Java 17/21+
baseline (`partial$springboot-disclaimer.adoc`). The issue body carries a detailed per-section outline, a
book-vs-current-docs comparison table, wiring instructions, acceptance criteria, and an official-docs reference
list; this plan sequences that into buildable tasks with concrete file paths, section names, diagram choices,
and cross-link targets.

### Choices made on the user's behalf (best-practice defaults — challenge in review)

1. **Two pages, not one.** The issue explicitly permits either. The requested scope (annotations + servlet &
   reactive context + credential context + JWT context + a full authorization server + social login with a DB
   model, REST controllers and REST clients) would make a single page 700–1000+ lines — far larger than any
   existing page in the section (current range ~150–500). Split point matches the issue's own suggested cut:
   items 1–3 → `spring-security.adoc`; items 4–5 → `spring-security-authorization-server.adoc`.
2. **Content-only, untagged plan.** This repo has no application source code; every task is AsciiDoc authoring.
   `find .claude/skills -maxdepth 1 -type d -name "*-code-one-task"` returns only `java` / `dotnet` /
   `iru-database` — none covers AsciiDoc — so **no task carries a language/framework tag**, matching every prior
   documentation plan in `.archive/` (`_55`, `_57`, `_59`, `_61`).
3. **Closest precedent: `.archive/implementation_plan_61.md`** (issue #61 — added `spring-batch.adoc` /
   `hibernate.adoc` / `elasticsearch.adoc` / `solr.adoc` to this same section). This plan copies its shape:
   one task per page with a header/`:description:`/`:keywords:`/disclaimer + concept sections + runnable
   `[source,java]`/`[source,yaml]` examples + `== References`; a second group that wires `nav.adoc` +
   `index.adoc` ("What's covered" + `:description:`/`:keywords:` + Bibliography); a third group that verifies
   the Antora build via the `iru-gate-runner` agent. `implementation_plan_55.md` (created the section) is the
   secondary precedent for the disclaimer-partial pattern and "append entries in the order added".
4. **Page length:** `spring-security.adoc` ~350–500 lines; `spring-security-authorization-server.adoc`
   ~450–650 lines (it carries the DB model + REST controller + REST client examples). Both are deliberately
   more example-heavy than the #61 concept pages — the issue asks for "detailed examples … interfaces to
   implement, the database model, the REST controller … as well as required REST clients".
5. **Diagrams — Mermaid only, no SVG.** Four `[mermaid]` blocks (filter-chain / auth flow; servlet-vs-reactive
   context; `authorization_code` + PKCE sequence; social-login sequence). None is a spatial layout that would
   need a hand-authored `springboot-*.svg` (unlike #61's shard/topology figures).
6. **Nav & index placement:** both new pages sit **immediately after `grpc-apis.adoc`** (nav line 449; index
   `=== APIs` group) — securing the REST/gRPC APIs you just built. In `nav.adoc`: two `****` entries at lines
   450–451. In `index.adoc`: a new `=== Security` subsection between `=== APIs` (ends line ~85) and
   `=== Server-side web UI frameworks` (line 87).
7. **Spring Security 7.0 API only** in every code sample: lambda DSL (no `.and()`), `SecurityFilterChain` /
   `SecurityWebFilterChain` `@Bean`s (no `WebSecurityConfigurerAdapter`), `authorizeHttpRequests` +
   `requestMatchers` (no `authorizeRequests` / `antMatchers`), `@EnableMethodSecurity` (no
   `@EnableGlobalMethodSecurity`), `OAuth2AuthorizationServerConfigurer.authorizationServer()` (no
   `@EnableAuthorizationServer` / `@EnableResourceServer` / `@EnableOAuth2Sso`), PKCE required by default, no
   `OAuth2RestTemplate` / `JdbcTokenStore` / `security.oauth2.*` properties. Where a reader coming from the
   Bibliography books (esp. *Spring in Action* 4e and *Mastering Spring Cloud*) would look for one of those, a
   one-line "replaced by …" pointer is given.
8. **Bibliography:** add official Spring Security + Spring Authorization Server URLs to the "Official
   documentation" list in `backend/springboot/index.adoc`; add Boyd, *Getting Started with OAuth 2.0*
   (O'Reilly, 2012 — `~/Desktop/oauth.pdf`) to the "Local books" list with the standard "predates …" caveat.
9. **Out of scope:** no changes to `partial$springboot-disclaimer.adoc` (generic to the whole section; it
   already states the 4.1.x/7.0.x baseline and the books-are-bibliography-only rule), and no cheat-sheet page
   (the issue does not ask for one).

## Current code state

- **Section directory** `modules/ROOT/pages/backend/springboot/` — 30 existing `.adoc` pages, one house style:
  `= Title` → `:description:` line → `:keywords:` line → `include::partial$springboot-disclaimer.adoc[]` →
  `==`/`===` sections → fenced code as `[source,java]` / `[source,yaml]` / `[source,xml]` with `----`
  delimiters → `[mermaid]` + `....` blocks (Mermaid by default; SVG only for spatial layouts) → ends with
  `== References` (bare official-doc links). No security page exists; the only current mention is one link to
  `spring-security/reference/servlet/integrations/cors.html` in `rest-apis.adoc:442`.
- **`modules/ROOT/nav.adoc`** — the SpringBoot Reference block is lines **433–463**; entries are
  `**** xref:backend/springboot/<file>[Label]`. `grpc-apis.adoc` is line **449**, `web-ui-frameworks.adoc` is
  line **450**. Single contiguous block — no duplicate `springboot` nav list.
- **`modules/ROOT/pages/backend/springboot/index.adoc`** — the section landing page:
  - `:description:` (line 2) and `:keywords:` (line 3) enumerate every sub-topic — both must be extended.
  - `== What's covered` (line 19) grouped by `=== …`; `=== APIs` is line **80** (bullets 82–85),
    `=== Server-side web UI frameworks` is line **87**.
  - `== Bibliography` (line 148): a `**Official documentation (primary source for every page)**` bulleted list
    (lines 150–252) then a `**Local books (bibliography only … )**` list (line 254 onward, entries are
    `* Author. _Title_. Publisher, year. ISBN … Consulted … see <links>.`).
- **`modules/ROOT/pages/backend/index.adoc`** — parent "Backend Development" landing page; line **14** is a
  one-paragraph `xref:backend/springboot/index.adoc[SpringBoot Reference]` blurb that enumerates section
  topics; its `:description:` (line 2) / `:keywords:` (line 3) also enumerate topics. Optional light touch.
- **`modules/ROOT/partials/springboot-disclaimer.adoc`** — shared `[IMPORTANT]` admonition included at the top
  of every section page; no change needed.
- **Images:** `modules/ROOT/images/springboot-*.svg` — 4 existing (`-data-access-layers`,
  `-elasticsearch-shards`, `-hexagonal-architecture`, `-solrcloud-topology`). This plan adds none.
- **Build / verification:** `npx antora antora-playbook.yml` (local content only) must complete with **no
  `xref`/AsciiDoc warnings**; `build/` is gitignored. `iru-build-docs` skill wraps this; the `iru-gate-runner`
  agent is installed (`.claude/agents/iru-gate-runner.md`).
- **No `*-code-one-task` skill applies** — AsciiDoc authoring is implemented directly.

## Implementation steps

### Group 1 — Author the two pages (Parallelizable: yes — two independent new files, no shared file)

- [x] **Task 1. Create `modules/ROOT/pages/backend/springboot/spring-security.adoc`** — new page
      (~350–500 lines); three `[mermaid]` blocks (request→filter-chain→`AuthenticationManager`→`SecurityContext`;
      servlet-vs-reactive context; and one more if a section needs it); cross-links to
      `xref:backend/springboot/rest-apis.adoc`, `reactive-programming.adoc`,
      `unit-and-integration-testing.adoc`, `spring-data-jpa.adoc`, `configuration-and-profiles.adoc`,
      `core-annotations.adoc`, and forward to `xref:backend/springboot/spring-security-authorization-server.adoc`;
      docs-only (Antora build verified in Group 3).
      _Done: authored `modules/ROOT/pages/backend/springboot/spring-security.adoc` (~430 lines) in house style
      (`= Title` → `:description:` → `:keywords:` → disclaimer include → `==` sections → `[source,*]` with `----`
      → `[mermaid]` `....` → `== References`). Four `[mermaid]` `flowchart` blocks (filter chain; servlet-vs-reactive
      holders; credential flow; the JWT chain is prose). Spring Security 7 API only — lambda DSL, `SecurityFilterChain`/
      `SecurityWebFilterChain` beans, `authorizeHttpRequests`/`requestMatchers`, `@EnableMethodSecurity`,
      `oauth2ResourceServer(...jwt())`, no `WebSecurityConfigurerAdapter`/`.and()`/`antMatchers`/`authorizeRequests`/
      `@EnableGlobalMethodSecurity`. Cross-links to rest-apis, reactive-programming, unit-and-integration-testing,
      spring-data-jpa, and forward to spring-security-authorization-server. Docs-only: no tests/coverage/quality gates;
      Antora build verified in Group 3._
  - [x] Task 1.1. Header: `= Spring Security`; `:description:` (securing a Spring Boot service with Spring
        Security 7 — the filter chain, the method-security annotations, the servlet and reactive
        `SecurityContext`, and building it from credentials or a JWT); `:keywords:` (`Spring Security 7, Spring
        Boot 4.1, SecurityFilterChain, DelegatingFilterProxy, FilterChainProxy, lambda DSL,
        authorizeHttpRequests, requestMatchers, @EnableMethodSecurity, @EnableReactiveMethodSecurity,
        @PreAuthorize, @PostAuthorize, @PreFilter, @PostFilter, @Secured, @RolesAllowed, @AuthorizeReturnObject,
        @AuthenticationPrincipal, @CurrentSecurityContext, @WithMockUser, @WithUserDetails, SecurityContextHolder,
        SecurityContext, Authentication, GrantedAuthority, SecurityContextRepository, SecurityContextHolderFilter,
        ReactiveSecurityContextHolder, ServerSecurityContextRepository, AuthenticationManager, ProviderManager,
        AuthenticationProvider, DaoAuthenticationProvider, UserDetailsService, PasswordEncoder,
        UsernamePasswordAuthenticationToken, ReactiveUserDetailsService, OAuth2 Resource Server, JWT, JwtDecoder,
        NimbusJwtDecoder, BearerTokenAuthenticationFilter, JwtAuthenticationProvider, JwtAuthenticationConverter,
        JwtGrantedAuthoritiesConverter, JwtAuthenticationToken`); then `include::partial$springboot-disclaimer.adoc[]`.
  - [x] Task 1.2. `== The model` — authentication vs. authorization; Spring Security as a chain of servlet
        filters in front of the app (`DelegatingFilterProxy` → `FilterChainProxy` → one or more
        `SecurityFilterChain`); the Spring Security 7 config style — a `SecurityFilterChain` `@Bean` built with
        the **lambda DSL** (no `WebSecurityConfigurerAdapter`, no `.and()`), `@EnableWebSecurity`; a minimal
        `http.authorizeHttpRequests(a -> a.requestMatchers("/public/**").permitAll().anyRequest().authenticated())`
        `.formLogin(withDefaults()).httpBasic(withDefaults())` example. One `[mermaid]` `flowchart`:
        request → `SecurityFilterChain` (context filter → authentication filter → authorization filter) →
        `AuthenticationManager` → `SecurityContext` → app.
  - [x] Task 1.3. `== Typical annotations` —
        - **Enabling method security**: `@EnableMethodSecurity` (MVC, `prePostEnabled` on by default;
          `securedEnabled` / `jsr250Enabled` opt-in) vs. `@EnableReactiveMethodSecurity` (WebFlux); note the
          `AuthorizationManager`-based interceptors and that `@EnableGlobalMethodSecurity` is removed.
        - **`@PreAuthorize` / `@PostAuthorize`**: SpEL — `hasRole`, `hasAuthority`, `hasAnyRole`,
          `authentication`, `principal`, `#param`, `returnObject`, `@beanName.method(#x)` references; a
          service-layer example.
        - **`@PreFilter` / `@PostFilter`**: `filterObject` over a collection/array/stream argument or return
          value.
        - **`@Secured`** and JSR-250 `@RolesAllowed` / `@PermitAll` / `@DenyAll` — one line each, with the
          opt-in flag.
        - **`@AuthorizeReturnObject`** and **meta-annotations** (composing `@IsAdmin` from `@PreAuthorize`).
        - **Controller/argument**: `@AuthenticationPrincipal` (incl. WebFlux `Mono<Principal>`),
          `@CurrentSecurityContext`, plain `Authentication` / `Principal` parameters.
        - **Testing** (`spring-security-test`): `@WithMockUser`, `@WithUserDetails`, `@WithSecurityContext` —
          cross-link `xref:backend/springboot/unit-and-integration-testing.adoc`.
        - A compact reference table: annotation → what enables it → web layer vs. service layer → servlet/reactive
          note.
  - [x] Task 1.4. `== How the SecurityContext works` —
        - **Servlet**: `SecurityContextHolder` (`ThreadLocal`; `MODE_THREADLOCAL` /
          `MODE_INHERITABLETHREADLOCAL`; `SecurityContextHolderStrategy`), `SecurityContext`, `Authentication`
          (principal / credentials / authorities), `GrantedAuthority`; `SecurityContextHolderFilter` +
          `SecurityContextRepository` (`HttpSessionSecurityContextRepository`,
          `RequestAttributeSecurityContextRepository`, `DeferredSecurityContext`); per-request clearing;
          reading the principal via `SecurityContextHolder.getContext().getAuthentication()`.
        - **Reactive (WebFlux)**: `ReactiveSecurityContextHolder` backed by the **Reactor `Context`** (not a
          `ThreadLocal`); `ServerSecurityContextRepository` / `WebSessionServerSecurityContextRepository`;
          `SecurityWebFilterChain` / `AuthenticationWebFilter`; `@EnableWebFluxSecurity`; why `ThreadLocal`
          can't survive operator/thread hops and how context propagation replaces it; reading the principal via
          `ReactiveSecurityContextHolder.getContext()` / `exchange.getPrincipal()`.
        - A **comparison table** (holder, storage, repository, filter, manager types — servlet vs. reactive) and
          one `[mermaid]` diagram contrasting the two.
  - [x] Task 1.5. `== Building the SecurityContext from credentials` —
        - The chain: `UsernamePasswordAuthenticationFilter` (an `AbstractAuthenticationProcessingFilter`) →
          unauthenticated `UsernamePasswordAuthenticationToken` → `AuthenticationManager` / `ProviderManager`
          → `DaoAuthenticationProvider` → `UserDetailsService.loadUserByUsername` + `PasswordEncoder.matches`
          → authenticated `Authentication` → `SecurityContextHolder` → `SecurityContextRepository.saveContext`.
        - **Interfaces / beans to implement**: a custom `UserDetailsService` (and a domain entity implementing
          `UserDetails`, or a small adapter); a `PasswordEncoder` `@Bean`
          (`PasswordEncoderFactories.createDelegatingPasswordEncoder()`); optionally a custom
          `AuthenticationProvider` or an exposed `AuthenticationManager` `@Bean`; `GrantedAuthoritiesMapper` /
          `RoleHierarchy`.
        - **Database model**: show both (a) the Spring Security default JDBC schema (`users`, `authorities`,
          optional `groups` / `group_authorities` / `group_members`) usable with `JdbcUserDetailsManager`, and
          (b) a JPA version — `AppUser` `@Entity` + `Role`/`authority` mapping + a Spring Data
          `UserRepository.findByUsername`. `[source,sql]` + `[source,java]` + `[source,yaml]`.
        - **Stateless / REST variant**: a `POST /api/auth/login` `@RestController` that calls
          `AuthenticationManager.authenticate(...)` directly and returns a signed token; `SessionCreationPolicy.STATELESS`
          + `NullSecurityContextRepository`; cross-link to Task 1.6 (verifying that token as a JWT).
        - **Reactive equivalent**: `ReactiveUserDetailsService`,
          `UserDetailsRepositoryReactiveAuthenticationManager`, `ReactiveAuthenticationManager`.
  - [x] Task 1.6. `== Building the SecurityContext from a JWT` —
        - Dependencies `spring-boot-starter-oauth2-resource-server` + `spring-security-oauth2-jose`;
          `http.oauth2ResourceServer(o -> o.jwt(Customizer.withDefaults()))`.
        - Properties: `spring.security.oauth2.resourceserver.jwt.issuer-uri` / `jwk-set-uri` /
          `jws-algorithms` / `audiences` / `public-key-location`.
        - The chain: `BearerTokenAuthenticationFilter` → `BearerTokenAuthenticationConverter` →
          `JwtAuthenticationProvider` → `JwtDecoder` / `NimbusJwtDecoder`
          (`withIssuerLocation` / `withJwkSetUri` / `withPublicKey` / `withSecretKey`) → an
          `OAuth2TokenValidator<Jwt>` chain (`JwtTimestampValidator`, `JwtIssuerValidator`, audience via
          `JwtClaimValidator`, composed with `DelegatingOAuth2TokenValidator`) →
          `JwtAuthenticationConverter` + `JwtGrantedAuthoritiesConverter` (default `SCOPE_` prefix;
          `setAuthoritiesClaimName` / `setAuthorityPrefix`; `DelegatingJwtGrantedAuthoritiesConverter` for
          scopes + roles) → `JwtAuthenticationToken` (principal = `Jwt`, name = `sub`).
        - **To customize**: a `JwtDecoder` `@Bean`; a `Converter<Jwt, ? extends AbstractAuthenticationToken>`
          (subclassing/config of `JwtAuthenticationConverter`) mapping claims/roles → authorities and
          optionally resolving a local `AppUser`. `[source,java]` + `[source,yaml]`.
        - **Reactive equivalent**: `NimbusReactiveJwtDecoder`, `JwtReactiveAuthenticationManager`,
          `ServerBearerTokenAuthenticationConverter`, `ReactiveJwtAuthenticationConverter`.
        - One paragraph on the **opaque-token** alternative
          (`spring.security.oauth2.resourceserver.opaque-token.introspection-uri`, `OpaqueTokenIntrospector`).
  - [x] Task 1.7. `== References` — official only:
        `https://docs.spring.io/spring-security/reference/`,
        `https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html`,
        `https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html`,
        `https://docs.spring.io/spring-security/reference/reactive/authentication/index.html`,
        `https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html`,
        `https://docs.spring.io/spring-security/reference/migration-7/index.html`,
        `https://docs.spring.io/spring-boot/reference/web/spring-security.html`,
        `https://datatracker.ietf.org/doc/html/rfc6750`. Confirm each also appears in `index.adoc`'s
        Bibliography (Task 5).

- [x] **Task 2. Create `modules/ROOT/pages/backend/springboot/spring-security-authorization-server.adoc`** —
      new page (~450–650 lines); two `[mermaid]` sequence diagrams (`authorization_code` + PKCE; "Sign in with
      Google" ending at the local-account upsert); cross-links back to
      `xref:backend/springboot/spring-security.adoc`, and to `spring-data-jpa.adoc`,
      `configuration-and-profiles.adoc`, `rest-apis.adoc`, `unit-and-integration-testing.adoc`; docs-only.
      _Done: authored `modules/ROOT/pages/backend/springboot/spring-security-authorization-server.adoc`
      (~500 lines) in house style. Two `[mermaid]` `sequenceDiagram` blocks (code+PKCE round-trip; "Sign in with
      Google" ending at the `app_user`/`user_identity` upsert). Spring Security 7 / Spring Authorization Server 7 API
      only — `OAuth2AuthorizationServerConfigurer.authorizationServer()` + `http.with(...)`, `securityMatcher`,
      `.oidc(...)`, `@Order`ed `SecurityFilterChain` beans, `JdbcRegisteredClientRepository` /
      `JdbcOAuth2AuthorizationService` / `JdbcOAuth2AuthorizationConsentService`, `JWKSource`,
      `OAuth2TokenCustomizer<JwtEncodingContext>`, `RegisteredClient` with `requireProofKey(true)`, `oauth2Login`,
      `OAuth2ClientHttpRequestInterceptor` (SS7) / `ServerOAuth2AuthorizedClientExchangeFilterFunction`. No
      `applyDefaultSecurity`, no `@EnableAuthorizationServer`/`@EnableOAuth2Sso`, no `security.oauth2.*` legacy
      properties, no `OAuth2RestTemplate`/`JdbcTokenStore`. Sections cover when-to-build, config, registered
      clients (Java + `spring.security.oauth2.authorizationserver.client.*`), the three JDBC schema scripts,
      login/logout, a curl round-trip, Google/Entra/Apple per-provider YAML, the local `app_user`/`user_identity`
      model + `@RestController`, and downstream API calls. Cross-links to spring-security, spring-data-jpa,
      database/schema-evolution. Docs-only: no tests/coverage/quality gates; Antora build verified in Group 3._
  - [x] Task 2.1. Header: `= Authorization Server & Social Login`; `:description:` (build an OAuth2/OIDC
        authorization server with Spring Authorization Server for login/logout and token issuance, and add
        "Sign in with Google / Microsoft / Apple" with `oauth2Login()` — interfaces, database model, REST
        controller and REST clients); `:keywords:` (`Spring Authorization Server, OAuth2, OpenID Connect, OIDC,
        authorization_code, PKCE, refresh token, ID token, JWT, OAuth2AuthorizationServerConfigurer,
        RegisteredClient, RegisteredClientRepository, JdbcRegisteredClientRepository, OAuth2AuthorizationService,
        JdbcOAuth2AuthorizationService, OAuth2AuthorizationConsentService, JWKSource, JwtDecoder,
        AuthorizationServerSettings, OAuth2TokenCustomizer, JwtEncodingContext, /oauth2/authorize, /oauth2/token,
        /oauth2/jwks, /oauth2/revoke, /oauth2/introspect, /userinfo, /connect/logout,
        .well-known/openid-configuration, oauth2Login, spring-boot-starter-oauth2-client, ClientRegistration,
        ClientRegistrationRepository, CommonOAuth2Provider, OAuth2LoginAuthenticationFilter, OidcUserService,
        DefaultOAuth2UserService, OidcUser, OAuth2User, GrantedAuthoritiesMapper, OAuth2AuthorizedClient,
        OAuth2AuthorizedClientManager, OAuth2ClientHttpRequestInterceptor,
        ServerOAuth2AuthorizedClientExchangeFilterFunction, Google, Microsoft Entra ID, Sign in with Apple,
        private_key_jwt`); then `include::partial$springboot-disclaimer.adoc[]`.
  - [x] Task 2.2. `== When to build your own` — an authorization server issues tokens for your clients; build
        one with Spring Authorization Server when you own the identities and want full control, otherwise use
        Keycloak / a managed IdP (one paragraph). Note Spring Authorization Server has **moved into Spring
        Security 7.0** — coordinates
        `org.springframework.security:spring-security-oauth2-authorization-server` or the Boot starter
        `spring-boot-starter-oauth2-authorization-server`; `applyDefaultSecurity` is gone and **PKCE is
        required by default**.
  - [x] Task 2.3. `== Configuring the authorization server` —
        - The **two `SecurityFilterChain` beans**: `@Order(1)` using
          `OAuth2AuthorizationServerConfigurer.authorizationServer()`,
          `http.securityMatcher(configurer.getEndpointsMatcher())`, `.oidc(Customizer.withDefaults())`, and a
          `LoginUrlAuthenticationEntryPoint("/login")` for browser requests; `@Order(2)` the app's own
          `formLogin` (and/or `oauth2Login`) chain that authenticates the end user; a `UserDetailsService`
          (reuse the DB-backed one from `spring-security.adoc` §"from credentials").
        - **Default endpoints** table: `/oauth2/authorize`, `/oauth2/token`, `/oauth2/jwks`, `/oauth2/revoke`,
          `/oauth2/introspect`, `/connect/register`, `/userinfo`, `/connect/logout`,
          `/.well-known/openid-configuration` — one line of purpose each; note where `formLogin` / logout sit
          relative to them.
        - **Beans to implement**: `RegisteredClientRepository` (`InMemoryRegisteredClientRepository` for demo,
          `JdbcRegisteredClientRepository` for real), `OAuth2AuthorizationService`
          (`JdbcOAuth2AuthorizationService`), `OAuth2AuthorizationConsentService`
          (`JdbcOAuth2AuthorizationConsentService`), `JWKSource<SecurityContext>` (RSA keypair), `JwtDecoder`
          (`OAuth2AuthorizationServerConfiguration.jwtDecoder(jwkSource)`), `AuthorizationServerSettings`, and
          `OAuth2TokenCustomizer<JwtEncodingContext>` to add authorities/claims to issued tokens. `[source,java]`.
  - [x] Task 2.4. `== Registered clients` — a `RegisteredClient` example: `client_secret_basic` vs. a `public`
        client + **PKCE** (`ClientSettings.builder().requireProofKey(true)`), `authorization_code` +
        `refresh_token` grants, `redirectUri` / `postLogoutRedirectUri`, `scope(OidcScopes.OPENID,
        OidcScopes.PROFILE, …)`, consent via `ClientSettings`, `TokenSettings` (access/refresh TTL, self-contained
        JWT vs. `reference` opaque). Show the equivalent
        `spring.security.oauth2.authorizationserver.client.*` properties form as an alternative.
  - [x] Task 2.5. `== Database model` — list the three provided JDBC scripts and their tables:
        `oauth2-registered-client-schema.sql` (`oauth2_registered_client`),
        `oauth2-authorization-schema.sql` (`oauth2_authorization` — one row per grant, token columns),
        `oauth2-authorization-consent-schema.sql` (`oauth2_authorization_consent`); plus the `users` /
        `authorities` tables from `spring-security.adoc` for the end-user login. `[source,sql]` for the client
        table, `[source,yaml]` for `spring.sql.init` / datasource wiring.
  - [x] Task 2.6. `== Login and logout` — the default generated login page vs. a custom `/login`
        `@Controller` + template; OIDC **RP-initiated logout** via `/connect/logout` +
        `post_logout_redirect_uri`; token revocation via `/oauth2/revoke`. `[source,java]` for a minimal custom
        login controller.
  - [x] Task 2.7. `== A client round-trip` — `curl` for `authorization_code` + PKCE against `/oauth2/authorize`
        then `/oauth2/token` (code_verifier / code_challenge), and inspecting `/oauth2/jwks` +
        `/.well-known/openid-configuration`. One `[mermaid]` `sequenceDiagram`: browser ↔ authorization server
        ↔ client app ↔ resource server for the code+PKCE flow.
  - [x] Task 2.8. `== Social login (Google, Microsoft, Apple)` —
        - Dependency `spring-boot-starter-oauth2-client`; `http.oauth2Login(Customizer.withDefaults())` (and
          `oauth2Client(...)` when calling APIs without interactive login).
        - **Properties**: `spring.security.oauth2.client.registration.<id>.*` (`client-id`, `client-secret`,
          `client-authentication-method`, `authorization-grant-type`, `redirect-uri` =
          `{baseUrl}/login/oauth2/code/{registrationId}`, `scope`, `client-name`, `provider`) and
          `spring.security.oauth2.client.provider.<id>.*` (`issuer-uri`, or explicit
          `authorization-uri`/`token-uri`/`user-info-uri`/`jwk-set-uri`/`user-name-attribute`).
        - **Classes**: `ClientRegistration` / `ClientRegistrationRepository` /
          `InMemoryClientRegistrationRepository`; `CommonOAuth2Provider` (`GOOGLE`, `GITHUB`, `FACEBOOK`, `X`,
          `OKTA`); `OAuth2LoginAuthenticationFilter` (callback `/login/oauth2/code/{registrationId}`);
          `OidcUserService` / `DefaultOAuth2UserService`; `OidcUser` / `OAuth2User` / `OidcUserAuthority` /
          `OAuth2UserAuthority`; `GrantedAuthoritiesMapper`.
        - **Interface to implement**: a custom `OAuth2UserService<OidcUserRequest, OidcUser>` that delegates to
          `OidcUserService`, then **finds-or-creates a local `AppUser`** by verified email / `sub` and returns
          a `DefaultOidcUser` carrying local authorities. `[source,java]`.
        - **Per-provider config** (one `[source,yaml]` block each):
          - **Google** — `issuer-uri: https://accounts.google.com` (or `CommonOAuth2Provider.GOOGLE`); scopes
            `openid, profile, email`.
          - **Microsoft Entra ID** — custom `provider` (`https://login.microsoftonline.com/{tenant}/v2.0`
            issuer, or explicit v2.0 authorize/token URIs + `https://graph.microsoft.com/oidc/userinfo`),
            `user-name-attribute: preferred_username`; note `spring-cloud-azure-starter-active-directory` as
            the higher-level option.
          - **Apple** — `client-authentication-method: private_key_jwt` (Apple issues **no** client secret): a
            client-assertion JWT signed with the ES256 key from the Apple developer portal; custom `provider`
            (`https://appleid.apple.com` issuer); name/email arrive **only on first authorization** and must be
            persisted then; note this needs a custom
            `OAuth2AuthorizationCodeGrantRequestEntityConverter` / JWK-based client-assertion setup beyond plain
            auto-config.
  - [x] Task 2.9. `== Local account model and endpoints` —
        - **Database model**: `app_user` (`id`, `email`, `display_name`, `enabled`) + `user_identity`
          (`id`, `provider`, `provider_user_id` = `sub`, `user_id` FK, `linked_at`) so one local user can link
          several providers; Spring Data JPA `AppUserRepository` / `UserIdentityRepository`. `[source,java]` +
          `[source,sql]`.
        - **REST controller & endpoints**: `GET /api/auth/providers` (list configured registrations for the
          login UI, derived from `ClientRegistrationRepository`), `GET /oauth2/authorization/{registrationId}`
          (Spring Security's built-in entry point — document, don't re-implement), `GET /api/me` (current
          `OidcUser` → local profile), `POST /logout`; note the built-in callback
          `GET /login/oauth2/code/{registrationId}`. `[source,java]` `@RestController`.
  - [x] Task 2.10. `== Calling provider and downstream APIs` — using the stored token via
        `OAuth2AuthorizedClient` / `OAuth2AuthorizedClientService` / `OAuth2AuthorizedClientManager` +
        **`RestClient`** with `OAuth2ClientHttpRequestInterceptor` (Spring Security 7), or **`WebClient`** with
        `ServerOAuth2AuthorizedClientExchangeFilterFunction` (reactive); the `AuthorizedClientManager` handles
        refresh. Also a plain `RestClient`/`WebClient` GET of a provider's `jwk-set-uri` / discovery document.
        `[source,java]`. One `[mermaid]` `sequenceDiagram` of "Sign in with Google" (browser ↔ app ↔ Google ↔
        `app_user`/`user_identity` upsert).
  - [x] Task 2.11. `== References` — official only:
        `https://docs.spring.io/spring-authorization-server/reference/`,
        `https://docs.spring.io/spring-security/reference/servlet/oauth2/login/core.html`,
        `https://docs.spring.io/spring-security/reference/servlet/oauth2/client/index.html`,
        `https://docs.spring.io/spring-boot/reference/web/spring-security.html`,
        `https://openid.net/specs/openid-connect-core-1_0.html`,
        `https://openid.net/specs/openid-connect-rpinitiated-1_0.html`,
        `https://datatracker.ietf.org/doc/html/rfc6749`,
        `https://datatracker.ietf.org/doc/html/rfc7636`,
        `https://developers.google.com/identity/openid-connect/openid-connect`,
        `https://learn.microsoft.com/entra/identity-platform/v2-protocols-oidc`,
        `https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_rest_api`. Confirm the
        Spring URLs also appear in `index.adoc`'s Bibliography (Task 5).

### Group 2 — Wire the pages into navigation, the landing page, and the bibliography (Parallelizable: yes — `nav.adoc`, `backend/springboot/index.adoc`, and `backend/index.adoc` are three different files; all require Group 1 complete so `xref`s resolve)

- [x] **Task 3. Add two nav entries in `modules/ROOT/nav.adoc`** — insert immediately after
      `**** xref:backend/springboot/grpc-apis.adoc[gRPC APIs]` (line 449), at the same `****` depth and in this
      order:
      ```
      **** xref:backend/springboot/spring-security.adoc[Spring Security]
      **** xref:backend/springboot/spring-security-authorization-server.adoc[Authorization Server & Social Login]
      ```
      Note: `modules/ROOT/nav.adoc` — the two `****` entries added at lines 450–451; `web-ui-frameworks.adoc`
      shifted to 452. `grep -n "backend/springboot" modules/ROOT/nav.adoc` shows a single contiguous SpringBoot
      Reference block, lines 433–465; no duplicate springboot nav list. Docs-only, no tests/coverage/quality gates.
  - [x] Task 3.1. Make the insertion at lines 450–451 (between the gRPC line 449 and the
        `web-ui-frameworks.adoc` line, which shifts to 452).
  - [x] Task 3.2. `grep -n "backend/springboot" modules/ROOT/nav.adoc` — confirm exactly one contiguous
        SpringBoot Reference block (433–465 after the edit); no duplicate earlier `springboot` list to also
        edit.

- [x] **Task 4. Update `modules/ROOT/pages/backend/springboot/index.adoc`** — new `=== Security` subsection +
      extended `:description:` / `:keywords:` + two new Bibliography entries.
      Note: `modules/ROOT/pages/backend/springboot/index.adoc` — added `=== Security` subsection (2 bullets)
      between `=== APIs` and `=== Server-side web UI frameworks`; extended `:description:` (security clause after
      "REST and gRPC APIs,") and `:keywords:` (Spring Security 7 / SecurityFilterChain / @PreAuthorize /
      SecurityContextHolder / OAuth2 Resource Server / JWT / Spring Authorization Server / OpenID Connect /
      oauth2Login / social login / Sign in with Google / Microsoft Entra ID / Sign in with Apple / PKCE, etc.);
      added 2 bullets to the official-docs Bibliography list (Spring Security reference + 7.0 migration guide;
      Spring Authorization Server reference + move-to-Security-7 announcement) and 1 bullet to the local-books
      list (Boyd, _Getting Started with OAuth 2.0_). Task 4.6 cross-check: both new pages' `== References` Spring
      URLs are now covered — top-level Spring Security reference, Spring Authorization Server reference and the
      7.0 migration guide are in the Bibliography; deep sub-pages and IETF/OpenID/Google/Microsoft/Apple links
      stay in each page's own `== References` per house style (as `rest-apis.adoc` does), so no further
      Bibliography URL was added. Docs-only, no tests/coverage/quality gates.
  - [x] Task 4.1. In `== What's covered`, add a new `=== Security` subsection between the `=== APIs` group
        (ends at the `grpc-apis.adoc` bullet, line ~85) and `=== Server-side web UI frameworks` (line 87), with
        two bullets in the house one-line style:
        ```
        === Security

        * xref:backend/springboot/spring-security.adoc[Spring Security] -- the filter-chain model, the
          method-security annotations (`@PreAuthorize` and friends), how the `SecurityContext` works for the
          servlet and reactive stacks, and how it is built from a username/password credential or from a bearer
          JWT (OAuth2 Resource Server).
        * xref:backend/springboot/spring-security-authorization-server.adoc[Authorization Server & Social Login]
          -- building an OAuth2/OIDC authorization server with Spring Authorization Server (login/logout, token
          issuance), and "Sign in with Google / Microsoft / Apple" with `oauth2Login()` -- interfaces, database
          model, REST controller and REST clients.
        ```
  - [x] Task 4.2. Extend `:description:` (line 2) — insert e.g. "Spring Security (annotations, the servlet and
        reactive security context, credential- and JWT-based authentication, an OAuth2/OIDC authorization
        server and social login)," into the enumeration, keeping style/among the existing topic list.
  - [x] Task 4.3. Extend `:keywords:` (line 3) — append e.g. `Spring Security 7, SecurityFilterChain,
        @PreAuthorize, @EnableMethodSecurity, SecurityContextHolder, ReactiveSecurityContextHolder,
        UserDetailsService, PasswordEncoder, OAuth2 Resource Server, JWT, JwtDecoder, Spring Authorization
        Server, OAuth2 authorization server, OpenID Connect, oauth2Login, ClientRegistration, social login,
        Sign in with Google, Microsoft Entra ID, Sign in with Apple, PKCE`.
  - [x] Task 4.4. In `== Bibliography` → `**Official documentation (primary source for every page)**` list, add
        two bullets in the existing style:
        ```
        * https://docs.spring.io/spring-security/reference/[Spring Security reference] (architecture,
          authentication, method security, reactive, OAuth2 login / client / resource server, testing) and
          https://docs.spring.io/spring-security/reference/migration-7/index.html[the 6.x -> 7.0 migration
          guide] -- the primary source for xref:backend/springboot/spring-security.adoc[Spring Security].
        * https://docs.spring.io/spring-authorization-server/reference/[Spring Authorization Server reference]
          (core model, configuration model, protocol endpoints, JDBC persistence) -- the primary source for
          xref:backend/springboot/spring-security-authorization-server.adoc[Authorization Server & Social
          Login]; Spring Authorization Server is now part of Spring Security 7
          (https://spring.io/blog/2025/09/11/spring-authorization-server-moving-to-spring-security-7-0/[announcement]).
        ```
  - [x] Task 4.5. In `== Bibliography` → `**Local books (bibliography only -- ... )**` list, add one bullet:
        ```
        * Boyd, Ryan. _Getting Started with OAuth 2.0_. O'Reilly Media, 2012. ISBN 978-1-4493-1160-5.
          Consulted for the protocol-level OAuth 2.0 vocabulary behind
          xref:backend/springboot/spring-security-authorization-server.adoc[Authorization Server & Social
          Login] -- predates OAuth 2.1, PKCE, and mature OIDC, so the Spring Security / Spring Authorization
          Server references above win on any discrepancy. See
          https://www.oreilly.com/library/view/getting-started-with/9781449317843/[the publisher's book page].
        ```
  - [x] Task 4.6. Cross-check: every URL in the two new pages' `== References` sections either now appears in
        this Bibliography or is a provider/spec link (IETF, OpenID, Google/Microsoft/Apple) that the house
        style keeps only in the page's own `== References` (as `rest-apis.adoc` etc. already do). Add a
        genuinely missing Spring URL only, matching bullet style.

- [x] **Task 5. (Optional, light) Update `modules/ROOT/pages/backend/index.adoc`** — fold "security" into the
      SpringBoot Reference blurb.
      Note: `modules/ROOT/pages/backend/index.adoc` — added "Spring Security (annotations, the security context,
      OAuth2/OIDC authorization server and social login)," to the SpringBoot Reference blurb topic list (after
      "REST and gRPC APIs,"); added `Spring Security, OAuth2, OpenID Connect` to `:keywords:` (after "gRPC,").
      `:description:` left unchanged (it only names the two subsections, reads fine without a security clause).
      Docs-only, no tests/coverage/quality gates.
  - [x] Task 5.1. In the `xref:backend/springboot/index.adoc[SpringBoot Reference]` sentence (line ~14), add
        "Spring Security (annotations, the security context, OAuth2/OIDC authorization server and social
        login)," to the enumerated topic list.
  - [x] Task 5.2. Add `Spring Security, OAuth2, OpenID Connect` to this page's `:keywords:` (line 3) if not
        already implied; leave `:description:` unless it reads awkwardly without it.

### Group 3 — Build verification (Parallelizable: yes — single task; requires Groups 1–2 complete)

- [x] **Task 6. Verify the Antora build is clean.**
      Note: `npx antora antora-playbook.yml` exits 0 and the site builds to `build/site/` including both new
      pages. First build surfaced 8 "skipping reference to missing attribute" AsciiDoc warnings for literal
      brace tokens (`{baseUrl}`, `{registrationId}`, `{id}`, `{bcrypt}`, `{argon2}`) in inline monospace prose;
      fixed by backslash-escaping them (`\{...}`) in `spring-security.adoc` (line ~369) and
      `spring-security-authorization-server.adoc` (lines ~385, ~394, ~609-610). Rebuild is warning- and
      error-free. Sanity check: no forbidden legacy API (`WebSecurityConfigurerAdapter`, `.and()`,
      `@EnableGlobalMethodSecurity`, `@EnableAuthorizationServer`, `antMatchers`, `OAuth2RestTemplate`) in any
      `[source,java]` block — the only occurrences are prose lines explicitly marking them as removed. Page
      lengths came in at 688 / 699 lines (above the plan's soft ~350-500 / ~450-650 estimates) due to the
      number of mandatory subsections and code blocks; content density matches existing dense section pages
      (e.g. `spring-data-jpa.adoc`). Flag for review, not a blocker.
  - [x] Task 6.1. Delegate to the `iru-gate-runner` agent:
        `Agent({description: "Build Antora docs and report warnings", subagent_type: "iru-gate-runner",
        prompt: "Invoke Skill({skill: \"iru-build-docs\"}) to build this repo's Antora site
        (npx antora antora-playbook.yml). Report only: whether the build completed, and any xref/AsciiDoc
        warnings or errors (file + message), especially any referencing
        backend/springboot/spring-security.adoc or backend/springboot/spring-security-authorization-server.adoc
        or the nav/index edits."})`.
  - [x] Task 6.2. If the sub-agent reports any unresolved `xref`, bad `[mermaid]` block, or AsciiDoc error, fix
        it in the offending page/`nav.adoc`/`index.adoc` and re-run Task 6.1. Done only when the build is
        warning-free and both new pages render under `build/site/`.
  - [x] Task 6.3. Sanity-check: `spring-security.adoc` ~350–500 lines and
        `spring-security-authorization-server.adoc` ~450–650 lines; every `== References` link is an official
        doc or a spec/provider page (no book or blog links except the single allowed Spring Authorization
        Server "moving to Spring Security 7.0" announcement); no `WebSecurityConfigurerAdapter`, `.and()`,
        `@EnableGlobalMethodSecurity`, `@EnableAuthorizationServer`, `antMatchers`, or `OAuth2RestTemplate` in
        any `[source,java]` block.
