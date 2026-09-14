# Implementation Plan: Guides & References / Backend Development — OAuth Reference

## Task summary

Source: GitHub issue #129
Base branch: main

Issue [#129](https://github.com/albertoirurueta/docs/issues/129) asks for a new **OAuth Reference** section under
*Guides & References → Backend Development*, the fifth sibling of the existing Hibernate, SpringBoot, GraphQL and
Spring Batch references, authored directly into this repo's own `ROOT` Antora component (this repo has no
application source code — it *is* the Antora playbook + root component). Concretely:

1. **31 new AsciiDoc pages** under `modules/ROOT/pages/backend/oauth/`: a landing `index.adoc` (with a
   `== Bibliography`), **29 topic pages**, and a `cheat-sheet.adoc`.
2. **One new partial**: `modules/ROOT/partials/oauth-disclaimer.adoc` (house 3-part `[IMPORTANT]` template).
3. **Site wiring**: an inline nav block in `modules/ROOT/nav.adoc` appended after the Spring Batch Reference
   block, an "OAuth Reference" bullet in `modules/ROOT/pages/backend/index.adoc`, and OAuth terms added to the
   root `modules/ROOT/pages/index.adoc` `:keywords:`.
4. **Reciprocal cross-links** added to the two existing Spring Security pages (and
   `backend/springboot/index.adoc`), so the new section and the SpringBoot section point at each other instead
   of duplicating material.
5. **Figures**: hand-authored `modules/ROOT/images/oauth-*.svg` files plus `[mermaid]` blocks, placed per the
   issue's 📊 markers (a floor, not a ceiling).
6. **`modules/ROOT/attachments/oauth-cheat-sheet.pdf`** — exactly one A4 page, rendered from a throwaway
   print-ready HTML/CSS layout via headless Chromium; only the PDF is checked in.

Scope: **protocol-first**. The section documents OAuth 1.0/1.0a (RFC 5849), OAuth 2.0 (RFC 6749) as amended by
the Security BCP (**RFC 9700**), the in-progress **OAuth 2.1** consolidation (`draft-ietf-oauth-v2-1-16`,
3 September 2026 — always flagged as a draft, never as a published standard), OpenID Connect Core 1.0 and the
surrounding extension RFCs — including an explicitly enumerated set of **passwordless primary authentication
methods** (e-mail OTP, e-mail magic links / single-use tokens, SMS OTP, push approval, passkeys, device-bound
credentials, federated login and smart-card mTLS), kept strictly separate from **2FA/MFA, which the section
treats as an additional security layer stacked on a primary factor and never as a passwordless method in its own
right** — and only *then* maps them onto **Spring Boot 4.1.x / Spring Security 7.1.x**. The
issue's own page outline, source list, concept-comparison table, bibliography and twelve acceptance criteria are
exhaustive and are treated as the source of truth for content — this plan sequences them into buildable tasks,
it does not restate them.

### Choices made on your behalf (stated here so they can be challenged during review)

1. **This is a content-only, untagged plan.** Installed `*-code-one-task` skills are `database`, `dotnet`,
   `java` and `java-springboot` — none applies to AsciiDoc/SVG/PDF authoring, matching every prior documentation
   plan in `.archive/`. Every task below is therefore deliberately **untagged**, which a downstream `iru-code` run
   treats as "implement directly" rather than dispatch. The `[source,java]` / `[source,yaml]` / `[source,http]`
   blocks on the Spring pages are illustrative AsciiDoc content, not a compiled module — tagging them
   `java-springboot` would misdirect that skill into building a Maven project that does not exist here.
2. **Nav is written inline in `nav.adoc`, not as a `nav-oauth.adoc` partial.** This deviates from the
   Swift/C/C++ precedent in `.archive/` deliberately: partials exist under *Programming Languages* because those
   languages have a second home elsewhere in the tree, whereas every *Backend Development* subsection
   (Hibernate, SpringBoot, GraphQL, Spring Batch) is written inline with absolute `***`/`****` levels. OAuth has
   one home, so it follows the backend convention — inline, appended after line 606
   (`**** xref:backend/spring-batch/cheat-sheet.adoc[Cheat Sheet (PDF)]`) and before
   `** xref:apps/index.adoc[Apps]`.
3. **Closest precedent: `.archive/implementation_plan_111.md` (issue #111, Swift Reference)**, read during
   exploration — the same "new reference section: disclaimer partial → topic pages in thematic groups → landing
   page + cheat-sheet page → PDF → site wiring → build gate" shape. Its conventions are carried over: page
   anatomy, the 3-part disclaimer template, books cited **only** in `== Bibliography` (never as a page's primary
   source), and the cheat-sheet mechanism (hand-built HTML/CSS → headless Chromium → single A4 PDF, HTML not
   checked in).
4. **Topic pages are split into eight thematic groups rather than one 29-page group.** They are all independent
   files and forward `xref:`s between them resolve at the Group 13 build gate, so a single group would be
   technically valid — but the #111 precedent batches pages thematically so each group's validation stays
   reviewable, and that is followed here.
5. **The 2012 book is confined to three pages.** `~/Desktop/oauth.pdf` (*Getting Started with OAuth 2.0*, Ryan
   Boyd, O'Reilly, Feb 2012) predates RFC 6749 by eight months. Per the issue, it informs only
   `history-and-evolution.adoc`, `oauth-1-vs-oauth-2.adoc` and the role/terminology framing in
   `getting-started.adoc`, and appears in `index.adoc`'s `== Bibliography` as a consulted reference with its
   superseded recommendations (implicit grant, ROPC, embedded WebViews) explicitly called out. It is **not**
   checked in, attached or uploaded — only its publisher page is linked.
6. **Mermaid blocks get their own explicit gate.** This repo runs `node scripts/validate-mermaid.mjs` in CI
   (`.github/workflows/publish.yml`, `manual_publish.yml`; `npm run validate:mermaid`), and it was added after
   #111's PR review. Group 13 runs it as a first-class gate alongside the Antora build, not as an afterthought.
7. **No project-picker tile.** Like every other *Guides & References* subsection, the OAuth Reference lives only
   in `nav.adoc`, `backend/index.adoc` and its own `index.adoc`; the root `pages/index.adoc` gains keywords only.

## Current code state

- **Repository shape** — no application source. `antora.yml` declares component `irurueta`; `antora-playbook.yml`
  aggregates this repo (`url: .`) plus six remote repos. Content lives in `modules/ROOT/{pages,partials,images,
  attachments}`. Build: `npx antora antora-playbook.yml` → `build/site` (gitignored). No lint/test suite; the
  only meaningful verification is a clean Antora build plus `npm run validate:mermaid`.
- **`modules/ROOT/nav.adoc`** (612 lines) — *Guides & References → Backend Development* starts at line 472
  (`** xref:backend/index.adoc[Backend Development]`) and runs to line 606. Its five subsections are inline:
  Java (via `include::partial$nav-java.adoc[]`), Hibernate (474–505), SpringBoot (506–544), GraphQL (545–579),
  Spring Batch (580–606). Line 607 begins `** xref:apps/index.adoc[Apps]`.
- **`modules/ROOT/pages/backend/index.adoc`** (34 lines) — `:description:`/`:keywords:` (already mention
  "Spring Security, OAuth2, OpenID Connect") plus a `== Sections` list of five bullets, each an `xref:` and a
  one-sentence summary ending "…plus a downloadable cheat sheet".
- **`modules/ROOT/pages/backend/springboot/spring-security.adoc`** (691 lines) — Spring Security 7 / Spring Boot
  4.1 baseline. Sections: the filter-chain model (with a `[mermaid]` flowchart), method-security annotations,
  `SecurityContext` on servlet and reactive stacks, building it from credentials (incl. a database model), and
  **building it from a JWT** (lines 570–681: `spring-boot-starter-oauth2-resource-server`,
  `oauth2ResourceServer(...jwt(...))`, the `BearerTokenAuthenticationFilter → JwtAuthenticationProvider →
  NimbusJwtDecoder → OAuth2TokenValidator<Jwt> chain → JwtAuthenticationConverter` pipeline,
  `JwtGrantedAuthoritiesConverter`, the reactive equivalent, and **opaque tokens** via
  `OpaqueTokenIntrospector` / RFC 7662). `== References` at line 682.
- **`modules/ROOT/pages/backend/springboot/spring-security-authorization-server.adoc`** (703 lines) — Spring
  Authorization Server (noted as *moved into Spring Security 7.0*; `applyDefaultSecurity` gone; **PKCE required
  by default**). Sections: when to build your own, configuring the AS, default endpoints
  (`/oauth2/authorize`, `/oauth2/token`, `/oauth2/jwks`, `/oauth2/revoke`, `/oauth2/introspect`, `/userinfo`,
  `/connect/logout`, `.well-known/openid-configuration`), beans to implement, `RegisteredClient`, database
  model, login/logout, a client round-trip, **social login** (`oauth2Login()`, `OidcUserService`, per-provider
  config for Google / Microsoft Entra / Apple), local account model, calling downstream APIs
  (`OAuth2AuthorizedClientManager`). `== References` at line 691.
- **`modules/ROOT/partials/`** — 49 partials; the disclaimer template to copy is `springboot-disclaimer.adoc`
  (an `[IMPORTANT]` `====` block: scope/version sentence naming the official docs as what the pages are
  "written and verified against" → AI-assistance disclosure → pointer to the section's `#_bibliography` anchor).
  `spring-batch-disclaimer.adoc` is the shorter variant.
- **`modules/ROOT/images/`** — SVGs are section-prefixed (`springboot-*.svg`, `spring-batch-*.svg`). Include
  convention: `image::<name>.svg[<long descriptive alt text>,width=700,role=text-center]`.
- **`modules/ROOT/attachments/`** — 30 `*-cheat-sheet.pdf` files; `spring-batch-cheat-sheet.pdf` and
  `springboot-cheat-sheet.pdf` are the visual reference. Linked as
  `xref:attachment$<name>-cheat-sheet.pdf[Download the … Cheat Sheet (PDF)]`.
- **`.archive/`** — 66 prior plans. `implementation_plan_111.md` (Swift Reference, 45 pages, 16 groups) is the
  structural precedent; `_105/_106/_109/_110` are the same pattern at smaller scale.
- **Nothing in the repo currently covers**: OAuth 1.0 at all, the 1.0 → 2.0 evolution, refresh-token rotation,
  the device grant, token exchange, implicit/ROPC deprecation, RFC 8252/10017 app-type guidance, DPoP/mTLS,
  PAR/JAR/FAPI, scopes-vs-claims/RAR/step-up, the OIDC logout family/CIBA/discovery, or 2FA/passwordless.

## Implementation steps

> Conventions every page task below inherits (do not restate per task): create the file under
> `modules/ROOT/pages/backend/oauth/`; start with `= <Title>`, a `:description:`, a `:keywords:`, then
> `include::partial$oauth-disclaimer.adoc[]`; show the **actual wire format** (HTTP request/response with every
> parameter named, `curl` where it helps) for whatever the page describes — not library calls, except on the
> three Spring pages; name the **RFC/spec section(s) the page is built on** in its `== References`, and close
> that section with links to **only** official specifications and official vendor/framework documentation
> (datatracker.ietf.org, rfc-editor.org, openid.net, w3.org, fidoalliance.org, nist.gov, docs.spring.io).
> Deprecated or removed constructs (implicit grant, ROPC, embedded WebViews, `alg: none`) are always presented
> as legacy with their replacement named. OAuth 2.1 material is always flagged as `draft-ietf-oauth-v2-1-16`,
> not as a published standard. Prefer `xref:` links to sibling OAuth pages over repeating material, and `xref:`
> into `backend/springboot/` rather than restating anything already documented there.

### Group 1 — Disclaimer partial (Parallelizable: yes)

Must land before any page, since every page includes it.

- [x] Task 1. Create `modules/ROOT/partials/oauth-disclaimer.adoc`
  - [x] Task 1.1. Copy the shape of `modules/ROOT/partials/springboot-disclaimer.adoc` exactly: an `[IMPORTANT]`
        block (`====` delimiters) with (a) a scope/version sentence — this section documents **OAuth 2.0
        (RFC 6749) as amended by the OAuth 2.0 Security Best Current Practice (RFC 9700)**, **OpenID Connect
        Core 1.0**, and, for the Spring pages, **Spring Boot 4.1.x / Spring Security 7.1.x**, written and
        verified against the IETF RFCs at https://datatracker.ietf.org/, the OpenID Foundation specifications
        at https://openid.net/developers/specs/ and the Spring reference documentation — *which are the
        references these pages are written and verified against*; (b) a sentence stating that **OAuth 2.1 is
        still an Internet-Draft** (`draft-ietf-oauth-v2-1-16`) and is always flagged as such, never presented as
        a published standard; (c) the standard AI-assistance disclosure sentence; (d) a pointer to
        `xref:backend/oauth/index.adoc#_bibliography[bibliography]`.
  - [x] Task 1.2. Keep it to the short template — no book title, no evaluation paragraph (the 2012 book is cited
        only in the landing page's `== Bibliography`).

### Group 2 — Foundations (Parallelizable: yes)

- [x] Task 2. `getting-started.adoc` — "Getting Started with OAuth"
  - [x] Task 2.1. The problem OAuth solves: the valet-key analogy and the concrete costs of asking a third party
        for the user's password (trust, phishing desensitisation, over-broad access, breakage on password change,
        revocation only by password change, users who have no password under federation, and the inability to add
        CAPTCHA or MFA behind a password field — the last one forward-links to
        `authentication-methods-2fa-and-passwordless.adoc`).
  - [x] Task 2.2. The four roles (resource owner, client, authorization server, resource server) and how they
        collapse in real deployments; authorization vs. authentication vs. federated authentication vs. delegated
        authorization; confidential vs. public clients; client registration and why it exists; the endpoints
        (`/authorize`, `/token`, the well-known metadata document).
  - [x] Task 2.3. One complete wire-level authorization-code + PKCE round-trip, end to end.
  - [x] Task 2.4. One short paragraph comparing OAuth to non-OAuth API authentication (API keys, HMAC request
        signing, mTLS-only) — per the issue's out-of-scope note, a paragraph, not a page.
  - [x] Task 2.5. Add `modules/ROOT/images/oauth-roles-and-trust-boundaries.svg` (the four roles and the trust
        boundaries between them) and a `[mermaid]` sequence diagram of the round-trip from Task 2.3.
- [x] Task 3. `history-and-evolution.adoc` — "How OAuth Evolved"
  - [x] Task 3.1. The pre-OAuth proprietary era (Google ClientLogin/AuthSub, Yahoo! BBAuth) and why a standard
        was needed; OAuth Core 1.0 (Dec 2007); Security Advisory 2009.1 (https://oauth.net/advisories/2009-1/)
        and the session-fixation fix that produced Revision A (Jun 2009); RFC 5849 (Apr 2010).
  - [x] Task 3.2. OAuth WRAP and the removal of signatures; RFC 6749/6750 (Oct 2012); the signatures debate
        including Eran Hammer-Lahav's *"OAuth 2.0 (without Signatures) Is Bad for the Web"* and his
        *"OAuth 2.0 and the Road to Hell"* resignation.
  - [x] Task 3.3. The extension decade, as a table keyed by RFC number → what it added (7009, 7519, 7591/7592,
        7636, 7662, 8252, 8414, 8628, 8693, 8705, 9068, 9101, 9126, 9207, 9396, 9449, 9470, 9700, 9728, 10017,
        10027); then the OAuth 2.1 consolidation (`draft-ietf-oauth-v2-1-16`, 3 Sep 2026, WG document with a
        December 2026 "submit to IESG" milestone) and its three headline changes — PKCE mandatory for *all*
        authorization-code clients including confidential ones, implicit removed, ROPC removed — plus tightened
        refresh-token and redirect-URI rules.
  - [x] Task 3.4. Add `modules/ROOT/images/oauth-timeline.svg` — 2007 → 2026 timeline marking 1.0, 1.0a, WRAP,
        RFC 6749, the extension era and the 2.1 draft.
- [x] Task 4. `oauth-1-0.adoc` — "OAuth 1.0a"
  - [x] Task 4.1. Consumer key/secret; the three-legged dance (request token → user authorization →
        `oauth_verifier` → access token) and the two-legged variant; the `Authorization: OAuth` header and its
        `oauth_*` parameters.
  - [x] Task 4.2. The **signature base string** (normalised HTTP method + URL + sorted percent-encoded
        parameters), the `HMAC-SHA1` / `RSA-SHA1` / `PLAINTEXT` methods, `oauth_nonce` + `oauth_timestamp` replay
        protection, and the token secret. Worked example with a real base string.
  - [x] Task 4.3. Where it still survives (long-lived enterprise/legacy APIs) and what to do when you meet one.
  - [x] Task 4.4. Add a `[mermaid]` sequence diagram of the three-legged flow and
        `modules/ROOT/images/oauth-1-signature-base-string.svg` showing base-string construction.
- [x] Task 5. `oauth-1-vs-oauth-2.adoc` — "OAuth 1.0 vs. OAuth 2.0"
  - [x] Task 5.1. Bullet by bullet, **each OAuth 1.0 limitation and what 2.0 did about it**: per-request
        cryptographic signatures (developer burden, canonicalisation/encoding interop bugs, no story for
        library-less clients) → bearer tokens over mandatory TLS; no AS/RS separation → explicit role split and
        centralised issuance; one flow for one client shape → grant types for server-side web apps, SPAs,
        native/mobile, devices and M2M; no token expiry or renewal → short-lived access tokens plus refresh
        tokens; no scopes → `scope`; a closed spec → an extension framework.
  - [x] Task 5.2. The honest counter-column: what 2.0 gave up — no built-in proof of possession, so a leaked
        token is usable by anyone (re-solved only years later by mTLS and DPoP → `xref:` to
        `sender-constrained-tokens-dpop-and-mtls.adoc`); "a framework, not a protocol", so two compliant
        implementations need not interoperate (answered by discovery, the Security BCP, FAPI and 2.1).
  - [x] Task 5.3. A side-by-side comparison table, and `modules/ROOT/images/oauth-1-vs-2-request.svg`
        contrasting a signed 1.0 request with a bearer-token 2.0 request.

### Group 3 — Tokens (Parallelizable: yes)

- [x] Task 6. `access-and-refresh-tokens.adoc` — "Access and Refresh Tokens"
  - [x] Task 6.1. What an access token *is* to the client (opaque, even when it is a JWT); bearer vs.
        sender-constrained; by-value vs. by-reference with a trade-off table; lifetime, `aud` and scope; where a
        token may be stored per client type.
  - [x] Task 6.2. The token response (`access_token`, `token_type`, `expires_in`, `refresh_token`, `scope`) and
        the standard error responses, wire-level.
  - [x] Task 6.3. **Refresh tokens**: why they exist, rotation, reuse detection and the "replay means revoke the
        whole family" rule, absolute vs. idle expiry, sender-constraining for public clients (RFC 9700 §4.14 and
        OAuth 2.1), and the `refresh_token` grant wire format.
  - [x] Task 6.4. Add a `[mermaid]` diagram: access-token expiry → refresh → rotation, including the
        reuse-detection branch.
- [x] Task 7. `id-tokens-vs-access-tokens.adoc` — "ID Tokens vs. Access Tokens"
  - [x] Task 7.1. The distinction: the **ID token** is a statement *to the client* about an authentication
        event; the **access token** is a credential *for an API*. The ID-token claims (`iss`, `sub`, `aud`,
        `exp`, `iat`, `nonce`, `auth_time`, `acr`, `amr`, `azp`).
  - [x] Task 7.2. Why sending an ID token to an API, and why treating an access token as proof of login, are both
        broken — with the concrete failure mode for each.
  - [x] Task 7.3. A comparison table of ID token / access token / refresh token (purpose, audience, format,
        lifetime, who validates it, what happens when it leaks), plus
        `modules/ROOT/images/oauth-three-token-types.svg`.
- [x] Task 8. `jwt-and-jose.adoc` — "JWT and the JOSE Family"
  - [x] Task 8.1. JWS (7515), JWE (7516), JWK (7517), JWA (7518), JWT (7519) and how they fit together; compact
        serialisation and the three parts; registered vs. public vs. private claims.
  - [x] Task 8.2. Signing algorithms (`RS256`, `ES256`, `EdDSA`, `HS256`) and how to choose; the classic attacks
        — `alg: none`, HMAC/RSA algorithm confusion, unverified `kid` path traversal, missing `aud`/`iss`/`exp`
        checks — and RFC 8725's countermeasures (note `draft-ietf-oauth-rfc8725bis` is in the RFC Editor queue).
  - [x] Task 8.3. JWKS endpoints, `kid`, key rotation and caching; nested/encrypted JWTs and when encryption is
        actually needed; RFC 9068's `at+jwt` profile and its required claims; SD-JWT (RFC 9901) in one paragraph.
  - [x] Task 8.4. A **validation checklist** every resource server must implement, then the honest limitation —
        a JWT cannot be revoked before `exp` — bridging to `opaque-tokens-introspection-and-revocation.adoc`.
        `xref:` `backend/springboot/spring-security.adoc` for how Spring implements this validation.
  - [x] Task 8.5. Add `modules/ROOT/images/oauth-jwt-anatomy.svg` (a decoded JWT) and a `[mermaid]` diagram of
        the validation pipeline.
- [x] Task 9. `opaque-tokens-introspection-and-revocation.adoc` — "Opaque Tokens, Introspection and Revocation"
  - [x] Task 9.1. RFC 7662 introspection: request, response, caching, and how the introspecting RS authenticates;
        RFC 9701 JWT introspection responses.
  - [x] Task 9.2. RFC 7009 revocation (`token`, `token_type_hint`) and what revocation does and does not reach;
        token status lists (`draft-ietf-oauth-status-list`); session vs. token lifetime.
  - [x] Task 9.3. A decision table for **JWT vs. opaque** (latency, revocation immediacy, privacy, PII in tokens,
        multi-audience, operational coupling). `xref:` the opaque-token section of
        `backend/springboot/spring-security.adoc`.
  - [x] Task 9.4. Add a `[mermaid]` sequence diagram: RS introspects vs. RS validates locally.
- [x] Task 10. `scopes-claims-and-permissions.adoc` — "Scopes, Claims and Permissions"
  - [x] Task 10.1. `scope` as a *request for delegated capability*, not a role; scopes vs. claims vs. roles vs.
        entitlements and which belongs in the token; naming conventions; incremental authorization and
        down-scoping.
  - [x] Task 10.2. Audience restriction and `resource` indicators (RFC 8707); Rich Authorization Requests
        (RFC 9396) for structured, transaction-level authorization; step-up (RFC 9470,
        `insufficient_user_authentication`) with a forward `xref:` to
        `authentication-methods-2fa-and-passwordless.adoc`.
  - [x] Task 10.3. Where the authorization decision should live (AS vs. RS vs. policy engine); name OPA/Rego,
        Cedar and AuthZEN as adjacent work without documenting them (per the issue's out-of-scope note).
  - [x] Task 10.4. Add a `[mermaid]` decision tree: scope, claim, RAR, or "not in the token at all".

### Group 4 — Flows I: choosing a grant and the core grants (Parallelizable: yes)

- [x] Task 11. `flows-overview.adoc` — "Choosing an OAuth Flow"
  - [x] Task 11.1. A decision tree keyed on client shape (server-side web app, SPA, native/mobile,
        input-constrained device, CLI, daemon/service, service-to-service on behalf of a user, first-party app).
  - [x] Task 11.2. A table of every grant type with its `grant_type` value, defining spec, the client types it
        suits, and **status** (current / conditional / legacy / removed in OAuth 2.1).
  - [x] Task 11.3. State the governing rule plainly — a client should never see the user's password — and
        `xref:` the pages that justify it.
  - [x] Task 11.4. Draw the distinction this section keeps coming back to: an OAuth **grant type** is how a
        *client* obtains a token; an **authentication method** (password, OTP, magic link, passkey, trusted
        device) is how the *authorization server* identifies the user behind that grant, and the client never
        sees it. Add that **2FA is a third thing again** — not a grant type and not a primary method, but a
        layer stacked on whichever primary method is in use. Point at
        `xref:backend/oauth/authentication-methods-2fa-and-passwordless.adoc` for the enumerated list, so a
        reader looking for "the 2FA flow" or "the passkey flow" lands there rather than hunting for a grant type
        that does not exist.
  - [x] Task 11.5. Add a `[mermaid]` decision flowchart.
- [x] Task 12. `authorization-code-and-pkce.adoc` — "Authorization Code and PKCE"
  - [x] Task 12.1. Every authorization-request parameter (`response_type`, `client_id`, `redirect_uri`, `scope`,
        `state`, `code_challenge`, `code_challenge_method`, `nonce`, `prompt`, `login_hint`, `max_age`,
        `acr_values`, `response_mode`), the authorization response and the `iss` parameter (RFC 9207), the token
        request and client authentication, the token response, and every error code — all wire-level.
  - [x] Task 12.2. **PKCE**: the `code_verifier`/`S256` challenge, the attack it stops (authorization-code
        interception), and why 2.1 requires it even for confidential clients — noting Spring Authorization Server
        already requires it by default (`xref:` `backend/springboot/spring-security-authorization-server.adoc`).
  - [x] Task 12.3. `state` vs. `nonce` vs. PKCE — what each actually protects, as a table; exact redirect-URI
        matching; the OIDC hybrid flow in one paragraph.
  - [x] Task 12.4. Add a `[mermaid]` sequence diagram with the PKCE values annotated at each step.
- [x] Task 13. `client-credentials-and-client-authentication.adoc` — "Client Credentials and Client
      Authentication"
  - [x] Task 13.1. Machine-to-machine with no user; why there is no refresh token and no consent; the wire
        exchange.
  - [x] Task 13.2. The client-authentication methods side by side — `client_secret_basic`, `client_secret_post`,
        `client_secret_jwt`, `private_key_jwt` (RFC 7523), `tls_client_auth` / `self_signed_tls_client_auth`
        (RFC 8705), `none` for public clients, and `draft-ietf-oauth-attestation-based-client-auth` — with a
        recommendation order and a note that `draft-ietf-oauth-rfc7523bis` is in the RFC Editor queue.
  - [x] Task 13.3. Secret rotation and storage; when a service mesh / workload identity (SPIFFE) is the better
        answer.
  - [x] Task 13.4. Add a `[mermaid]` sequence diagram.
- [x] Task 14. `device-authorization-grant.adoc` — "Device Authorization Grant"
  - [x] Task 14.1. RFC 8628 for TVs, consoles, CLIs and IoT: `device_code`, `user_code`, `verification_uri`,
        `verification_uri_complete`, `interval`, and the polling loop with its `authorization_pending` /
        `slow_down` / `access_denied` / `expired_token` responses — wire-level.
  - [x] Task 14.2. The QR-code shortcut, and the cross-device phishing threat with RFC 10027's mitigations
        (short-lived codes, explicit device context on the consent screen, proximity checks).
  - [x] Task 14.3. Add a `[mermaid]` sequence diagram covering both the device and the user's browser.

### Group 5 — Flows II: delegation, legacy grants and app types (Parallelizable: yes)

- [x] Task 15. `token-exchange-and-assertion-grants.adoc` — "Token Exchange and Assertion Grants"
  - [x] Task 15.1. RFC 8693 token exchange: `subject_token`, `actor_token`, `requested_token_type`,
        impersonation vs. delegation, and the `act` claim — wire-level.
  - [x] Task 15.2. The assertion framework (RFC 7521) with the JWT bearer grant (RFC 7523) and SAML bearer grant
        (RFC 7522); identity chaining across domains (`draft-ietf-oauth-identity-chaining`, RFC Editor queue).
  - [x] Task 15.3. Where each fits a microservice topology, and a `[mermaid]` sequence diagram of a user token
        exchanged down a three-service call chain.
- [x] Task 16. `legacy-implicit-and-password-grants.adoc` — "Legacy Grants: Implicit and Password"
  - [x] Task 16.1. How the **implicit** grant worked (`response_type=token`, fragment response) and exactly why
        it is gone: no client authentication, tokens in the URL fragment and therefore in history/logs/`Referer`,
        no refresh token, trivially exfiltrated by any XSS, no protection against authorization-response
        injection. Replacement: authorization code + PKCE.
  - [x] Task 16.2. How **resource owner password credentials** worked and exactly why it is gone: the client
        handles the user's password (defeating the entire point of OAuth), no MFA or step-up, no CAPTCHA or risk
        engine, no federation or social login, no consent, no passwordless, and it is unusable for any account
        that has no password. Replacement: authorization code + PKCE in a system browser.
  - [x] Task 16.3. Migration notes for each, and the narrow first-party case still pushing for something similar
        (`draft-ietf-oauth-first-party-apps`). Note that the 2012 book recommends both — an explicit example of
        why it is a consulted reference and not a source of current practice.
- [x] Task 17. `native-and-mobile-apps.adoc` — "Native and Mobile Apps"
  - [x] Task 17.1. RFC 8252 / BCP 212: native apps **MUST NOT** use embedded user-agents (WebViews) — the app can
        read the password, the cookie jar is not shared so SSO breaks, and the user cannot see the real URL or
        the TLS indicator.
  - [x] Task 17.2. The correct choices: the **external browser**, or — better for UX — an **in-app browser tab**
        that keeps the browser's security properties and session: `ASWebAuthenticationSession` (and the older
        `SFSafariViewController`) on iOS, Custom Tabs on Android.
  - [x] Task 17.3. The three redirect-URI options (private-use URI scheme, claimed `https` via Universal Links /
        App Links, loopback `127.0.0.1`) with their trade-offs and hijacking risks; PKCE mandatory for public
        native clients; app-to-app SSO and OIDC Native SSO; AppAuth for iOS/Android.
  - [x] Task 17.4. The payoff section the issue asks for: **because login happens in a real browser owned by the
        authorization server, the AS — not the app — can add CAPTCHA and bot/brute-force defences, step-up and
        2FA, passkeys, device-risk checks, consent screens, federation and password-manager autofill, and can
        change any of them without an app release** — none of which is possible when the app posts a password to
        a token endpoint. Cross-link `legacy-implicit-and-password-grants.adoc` and
        `authentication-methods-2fa-and-passwordless.adoc`.
  - [x] Task 17.5. Add `modules/ROOT/images/oauth-native-user-agents.svg` — embedded WebView vs. in-app browser
        tab vs. external browser, annotated with what each actor can see.
- [x] Task 18. `browser-based-apps.adoc` — "Browser-Based Apps (SPAs)"
  - [x] Task 18.1. RFC 10017 / BCP 212 and the browser threat model: XSS is game over for any token reachable
        from JavaScript.
  - [x] Task 18.2. The recommended **backend-for-frontend (BFF)** pattern (token kept server-side, cookie session
        to the browser); the token-mediating backend variant; the browser-only variant with authorization code +
        PKCE, refresh-token rotation and sender-constraining, and its residual risks.
  - [x] Task 18.3. `localStorage` vs. `sessionStorage` vs. `HttpOnly` + `Secure` + `SameSite` cookies; CORS on
        the token endpoint; DPoP in the browser with a non-extractable `CryptoKey`; CSP as defence in depth.
  - [x] Task 18.4. Add a `[mermaid]` diagram contrasting the BFF topology with the browser-only topology.

### Group 6 — Security (Parallelizable: yes)

- [x] Task 19. `security-best-practices.adoc` — "Security Best Practices"
  - [x] Task 19.1. RFC 9700 consolidated into an actionable checklist, one section per attack, each written as
        **threat → mitigation → how to test it**: exact redirect-URI matching and open redirectors;
        authorization-code injection and replay (PKCE); CSRF and `state`; **mix-up attacks** and `iss`
        (RFC 9207); counterfeit/malicious authorization servers.
  - [x] Task 19.2. Access-token leakage through referrers, logs, browser history and error pages; refresh-token
        theft, rotation and reuse detection; clickjacking of the consent screen; TLS requirements and
        certificate validation — noting this is precisely the weakness the 2012 book already worried about when
        signatures were dropped; `scope` escalation.
  - [x] Task 19.3. What RFC 6819's threat model adds, and a note that
        `draft-ietf-oauth-security-topics-update` is tracking further changes.
  - [x] Task 19.4. Add a `[mermaid]` diagram of a mix-up attack and how `iss` defeats it.
- [x] Task 20. `sender-constrained-tokens-dpop-and-mtls.adoc` — "Sender-Constrained Tokens: DPoP and mTLS"
  - [x] Task 20.1. The bearer-token weakness stated plainly (whoever holds it, uses it).
  - [x] Task 20.2. **mTLS-bound tokens** (RFC 8705): `tls_client_auth`, the `cnf`/`x5t#S256` confirmation claim,
        certificate-bound access tokens, and where a PKI already exists.
  - [x] Task 20.3. **DPoP** (RFC 9449): the DPoP proof JWT, `htm`/`htu`/`iat`/`jti`/`ath`, the `jkt` thumbprint
        confirmation, nonces, replay windows, and key storage in browser and mobile. RFC 7800 `cnf` semantics.
  - [x] Task 20.4. A decision table, and the closing observation that this is OAuth 1.0's request signing coming
        back — scoped to where it pays for itself (`xref:` `oauth-1-vs-oauth-2.adoc`). Note Spring's support and
        `xref:` the DPoP recipe in `spring-boot-flow-recipes.adoc`.
  - [x] Task 20.5. Add a `[mermaid]` sequence diagram: a stolen bearer token succeeding vs. a stolen DPoP-bound
        token failing.
- [x] Task 21. `par-jar-and-hardened-profiles.adoc` — "PAR, JAR and Hardened Profiles"
  - [x] Task 21.1. **PAR** (RFC 9126): pushing the authorization request server-to-server and getting a
        `request_uri`, keeping parameters off the front channel and out of URL length limits — wire-level.
  - [x] Task 21.2. **JAR** (RFC 9101): the signed/encrypted `request` object, and how PAR and JAR compose.
  - [x] Task 21.3. The profiles that mandate them — **FAPI 1.0 Baseline/Advanced and FAPI 2.0** — what regulated
        deployments (open banking, health) actually require, and how conformance is certified.
  - [x] Task 21.4. Add a `[mermaid]` diagram contrasting a front-channel authorization request with PAR.

### Group 7 — OpenID Connect and identity (Parallelizable: yes)

- [x] Task 22. `openid-connect.adoc` — "OpenID Connect"
  - [x] Task 22.1. OIDC as the authentication layer *on top of* OAuth 2.0: `scope=openid`, the ID token and its
        validation rules, `nonce`, the standard claims and the `profile`/`email`/`address`/`phone` scopes, the
        UserInfo endpoint.
  - [x] Task 22.2. `response_type` combinations (code, hybrid, and the removed implicit ones); `prompt` /
        `max_age` / `login_hint` / `ui_locales` / `acr_values`; `auth_time` / `acr` / `amr` (RFC 8176); pairwise
        vs. public subject identifiers.
  - [x] Task 22.3. The difference between "the user logged in just now" and "the client has a token"; note that
        the 2012 book's draft-era "check ID endpoint" never shipped in OIDC Core 1.0.
  - [x] Task 22.4. Add a `[mermaid]` sequence diagram: OIDC authorization code flow, ID token and UserInfo.
- [x] Task 23. `discovery-metadata-and-client-registration.adoc` — "Discovery, Metadata and Client Registration"
  - [x] Task 23.1. `.well-known/openid-configuration` and RFC 8414 `.well-known/oauth-authorization-server`;
        every metadata field a client actually reads, as a table.
  - [x] Task 23.2. **RFC 9728 protected resource metadata** and the `WWW-Authenticate` `resource_metadata` hint.
  - [x] Task 23.3. Dynamic client registration and management (RFC 7591/7592), software statements and initial
        access tokens; `draft-ietf-oauth-client-id-metadata-document`.
  - [x] Task 23.4. Issuer identification and multi-tenant issuers; JWKS publication and key rollover on both
        sides. `xref:` the Spring Authorization Server endpoint list in
        `backend/springboot/spring-security-authorization-server.adoc`.
- [x] Task 24. `logout-and-session-management.adoc` — "Logout and Session Management"
  - [x] Task 24.1. Why "logging out of the client" is not "logging out of the IdP".
  - [x] Task 24.2. RP-Initiated Logout (`end_session_endpoint`, `id_token_hint`, `post_logout_redirect_uri`);
        Front-Channel and Back-Channel Logout (the logout token, and why back-channel is the reliable one);
        Session Management 1.0 and its dependence on third-party cookies.
  - [x] Task 24.3. Token revocation's role (`xref:` `opaque-tokens-introspection-and-revocation.adoc`); single
        logout in a microservice/BFF topology.
  - [x] Task 24.4. Add a `[mermaid]` diagram of back-channel logout fanning out to three clients.
- [x] Task 25. `social-login-and-federation.adoc` — "Social Login and Federation"
  - [x] Task 25.1. "Sign in with Google / Microsoft / Apple / GitHub / Facebook" as the client side of OIDC.
  - [x] Task 25.2. **Account linking** and the verified-e-mail trap (never link on an unverified `email` claim);
        first-login provisioning; the multi-provider account model.
  - [x] Task 25.3. Provider quirks: Apple's `form_post` response mode and one-shot name release, GitHub's
        non-OIDC OAuth, Microsoft Entra tenant/issuer handling.
  - [x] Task 25.4. SAML 2.0 vs. OIDC for enterprise SSO and IdP-initiated flows — one comparison section only,
        per the issue's out-of-scope note; the broker/hub pattern (your AS federating to several upstream IdPs)
        vs. direct federation.
  - [x] Task 25.5. `xref:` `backend/springboot/spring-security-authorization-server.adoc` for the Spring
        implementation instead of repeating it; add a `[mermaid]` diagram of the broker pattern.
- [x] Task 26. `authentication-methods-2fa-and-passwordless.adoc` — "Authentication Methods: Passwordless
      and 2FA"
  - [x] Task 26.1. Frame the page on **two orthogonal axes**, and state the rule the rest of the page enforces:
        a **primary factor** is what identifies the user in the first place (a password, or one of the
        passwordless methods in Task 26.3); **2FA/MFA is an additional security layer stacked on top of a
        primary factor — it is never a primary method in its own right, and it is never "passwordless" by
        itself.** Spell out the four combinations so they cannot be confused: password alone (weakest);
        password + second factor (**not** passwordless — still a password login, just a hardened one);
        passwordless primary alone; passwordless primary + second factor (passwordless *and* multi-factor —
        the strongest, e.g. passkey + one-time token). Note up front that authentication happens **inside the
        authorization server**, invisible to the client, which is why OAuth can keep improving all of this
        without touching client code.
  - [x] Task 26.2. **Passwords as a primary factor**: handling (hashing, breach lists, policy), stressing that
        the *client* must never see them; the three factor categories (knowledge / possession / inherence) and
        which category each method on this page falls into.
  - [x] Task 26.3. **Passwordless primary authentication methods — an explicit enumerated list.** These
        *replace* the password as the primary factor. One short subsection per method, each stating: how it
        works on the wire, its single-use/TTL rules, whether it is phishing-resistant, its failure modes, when
        to choose it, and — where the same mechanism is also commonly used as a *second* factor (Task 26.4) —
        an explicit note that using it in that role does **not** make the login passwordless.
    - [x] Task 26.3.1. **E-mail one-time code (OTP)** — a 6–8 digit single-use code with a short TTL; rate
          limiting, lockout, and enumeration-safe responses ("if that address exists, we sent a code"). Also
          used as a second factor — see Task 26.4.
    - [x] Task 26.3.2. **E-mail magic link / single-use token** — a signed one-use URL token; TTL and
          single-use invalidation, the "opened in a different browser or device" problem, and the
          link-scanner/pre-fetch hazard that silently consumes the token.
    - [x] Task 26.3.3. **SMS one-time code (OTP)** — same shape as the e-mail code, plus NIST SP 800-63B's
          rating of SMS as a **restricted authenticator** (SIM-swap, SS7 interception) and the
          deliverability/cost caveats. Recommend it as a fallback, not a default. Also used as a second factor.
    - [x] Task 26.3.4. **Push approval as a primary factor** ("log in with your phone") — out-of-band approval
          on an already-enrolled device, with the enrolment binding that makes it a primary factor rather than
          a second one. Also used as a second factor, where its failure modes differ — see Task 26.4.
    - [x] Task 26.3.5. **Passkeys (WebAuthn/FIDO2)** — the registration and authentication ceremonies, platform
          vs. roaming authenticators, synced vs. device-bound credentials, discoverable credentials and
          username-less login, and **origin binding as the reason they are phishing-resistant**. Present this
          as the recommended default where the platform supports it.
    - [x] Task 26.3.6. **Device-bound credentials / "trusted device" tokens** — long-lived device cookies vs. a
          device-bound key pair; what a remembered device may and may not skip; binding to a device key rather
          than to a bearer cookie. Note that "remember this device" usually suppresses the *second factor*
          rather than the primary one, which is a Task 26.4 concern.
    - [x] Task 26.3.7. **Federated / social login as passwordless by delegation** — the account holds no
          password because an upstream IdP authenticates; `xref:` `social-login-and-federation.adoc`, and note
          that the assurance of the whole system is then the upstream IdP's, including whatever MFA it enforces.
    - [x] Task 26.3.8. **Certificate / smart-card (mTLS) authentication** — enterprise PKI, in one short
          paragraph; `xref:` `sender-constrained-tokens-dpop-and-mtls.adoc` for the token-binding side.
  - [x] Task 26.4. **2FA / MFA as an additional security layer.** Open by restating Task 26.1's rule: nothing
        in this section is a primary method, and adding any of it to a password login does **not** make that
        login passwordless. Then cover each layer and what it composes with:
    - [x] Task 26.4.1. **TOTP/HOTP authenticator apps** (RFC 6238/4226) — the canonical second factor:
          shared-secret provisioning and the QR `otpauth://` URI, drift windows, recovery codes. State
          explicitly that TOTP is **not** used as a primary factor (it proves possession of a shared secret,
          not identity) and therefore never appears in Task 26.3.
    - [x] Task 26.4.2. **E-mail or SMS OTP used as a second factor** — the same mechanism as Tasks 26.3.1 and
          26.3.3 in a different *role*; carry over the SP 800-63B restriction on SMS, which applies in both
          roles.
    - [x] Task 26.4.3. **Push approval as a second factor** — MFA-fatigue (push-bombing) attacks and why number
          matching exists.
    - [x] Task 26.4.4. **Hardware OTP tokens, and passkeys used as a second factor** — a passkey is strong
          enough to be a primary factor (Task 26.3.5), so using it merely as a second factor alongside a
          password is usually the wrong trade; say why.
    - [x] Task 26.4.5. **Recovery codes** and the step-up relationship — when a second factor is demanded only
          for a sensitive operation rather than at login (`xref:` Task 26.7 and RFC 9470).
    - [x] Task 26.4.6. A **combination matrix**: primary method (rows: password, each passwordless method) ×
          additional layer (columns: none, TOTP, OTP, push, passkey-as-2FA) → *is this passwordless?* and
          *is this phishing-resistant?* This is the table that makes the "2FA is a layer, not a passwordless
          method" rule concrete.
  - [x] Task 26.5. A **comparison table of the primary methods only** (Task 26.2 plus every method in Task
        26.3): factor category, phishing-resistant (yes/no), device dependence, recovery story, the NIST
        SP 800-63B AAL it can reach on its own, and typical use.
  - [x] Task 26.6. **Single-use token hygiene**, the concern shared by Tasks 26.3.1–26.3.3 and 26.4.2 in both
        roles: single-use enforcement, short TTL, rate limiting and lockout, enumeration-safe responses, replay
        and race conditions on concurrent redemption, and what to log on out-of-band delivery.
  - [x] Task 26.7. **Enrolment and account recovery — the weakest link**: bootstrapping a first passkey,
        recovery codes, and why falling back to e-mail OTP caps the assurance of every stronger method above
        it, whichever axis it sits on.
  - [x] Task 26.8. **How any of this reaches the client**: request it with `acr_values` / `prompt=login` /
        `max_age`, receive it in `acr` / `amr` / `auth_time`, and enforce an upgrade mid-session with RFC 9470
        step-up (`insufficient_user_authentication`, `acr_values`, `max_age` in the `WWW-Authenticate`
        challenge). Give the **RFC 8176 `amr` value for every method in Tasks 26.3 and 26.4** (e.g. `pwd`,
        `otp`, `sms`, `swk`, `hwk`, `user`, `mfa`), and make the orthogonality explicit: `amr` containing `mfa`
        says *more than one factor was used*, not *no password was used* — a client that needs "passwordless"
        must check for the absence of `pwd`, not the presence of `mfa`.
  - [x] Task 26.9. `xref:` `spring-boot-authentication-methods.adoc` for the Spring implementation of each
        method, and `xref:` `legacy-implicit-and-password-grants.adoc` / `native-and-mobile-apps.adoc` for why
        none of this is reachable when a client collects the password itself.
  - [x] Task 26.10. Add a `[mermaid]` sequence diagram of a step-up challenge (RS → client → AS → back) and
        `modules/ROOT/images/oauth-authentication-factors.svg` drawn on the **two axes of Task 26.1** — primary
        factor along one axis, additional layer along the other — so the figure itself shows 2FA as a layer
        rather than as a peer of the passwordless methods.
### Group 8 — Operating (Parallelizable: yes)

- [x] Task 27. `testing-and-debugging.adoc` — "Testing and Debugging OAuth"
  - [x] Task 27.1. Running each flow by hand with `curl`; decoding a JWT safely (never paste a production token
        into a web decoder).
  - [x] Task 27.2. The standard error codes (`invalid_request`, `invalid_client`, `invalid_grant`,
        `unauthorized_client`, `unsupported_grant_type`, `invalid_scope`, `access_denied`, `invalid_token`,
        `insufficient_scope`) as a table, with what each usually really means in practice; clock skew.
  - [x] Task 27.3. A local Keycloak or Spring Authorization Server container as a test issuer; Testcontainers in
        integration tests (`xref:` `backend/springboot/unit-and-integration-testing.adoc`); the OpenID Foundation
        conformance suites.

### Group 9 — Spring Boot integration (Parallelizable: yes)

These three pages are deliberately thin on anything the SpringBoot section already covers.

- [x] Task 28. `spring-boot-integration-overview.adoc` — "Spring Boot Integration: Overview"
  - [x] Task 28.1. The three roles a Spring service can play — **client** (`spring-boot-starter-oauth2-client`),
        **resource server** (`spring-boot-starter-oauth2-resource-server`), **authorization server**
        (`spring-boot-starter-oauth2-authorization-server`, now part of Spring Security 7) — and which starter to
        add for which.
  - [x] Task 28.2. A **protocol-concept → Spring-type mapping table**: authorization request →
        `OAuth2AuthorizationRequestResolver`; client config → `ClientRegistration` /
        `ClientRegistrationRepository`; token acquisition → `OAuth2AuthorizedClientManager` /
        `OAuth2AuthorizedClientProvider`; stored grant → `OAuth2AuthorizedClient` /
        `OAuth2AuthorizedClientRepository`; JWT validation → `JwtDecoder` + `OAuth2TokenValidator<Jwt>`;
        introspection → `OpaqueTokenIntrospector`; scope → `SCOPE_` authorities; ID token → `OidcUser`;
        issued-token customisation → `OAuth2TokenCustomizer`; registered client → `RegisteredClient` /
        `RegisteredClientRepository`.
  - [x] Task 28.3. An explicit **"already documented here"** table pointing at
        `xref:backend/springboot/spring-security.adoc` (filter chain, method security, resource-server JWT and
        opaque-token setup) and `xref:backend/springboot/spring-security-authorization-server.adoc`
        (authorization-server configuration, `RegisteredClient`, consent, social login) — so a reader is routed
        there rather than finding a second, divergent copy.
  - [x] Task 28.4. Add `modules/ROOT/images/oauth-spring-three-roles.svg` — the three roles in one deployment.
- [x] Task 29. `spring-boot-flow-recipes.adoc` — "Spring Boot Flow Recipes"
  - [x] Task 29.1. One minimal recipe per flow **only where the SpringBoot section does not already have one**,
        each with client-side config, server-side config and the resulting HTTP exchange, and each naming the RFC
        it implements plus an `xref:` back to the protocol page:
        `authorization_code` + PKCE as a client (link the existing page; add the PKCE-for-confidential-clients
        note), `client_credentials` with `OAuth2AuthorizedClientManager` and a `RestClient` interceptor,
        `refresh_token` and what Spring does on expiry.
  - [x] Task 29.2. `urn:ietf:params:oauth:grant-type:device_code` (both as a Spring Authorization Server grant
        and as a client), `urn:ietf:params:oauth:grant-type:token-exchange`, and
        `urn:ietf:params:oauth:grant-type:jwt-bearer`.
  - [x] Task 29.3. `private_key_jwt` and mTLS client authentication; **DPoP-bound tokens** on both the
        authorization-server and resource-server sides (Spring Security documents these at
        `servlet/oauth2/resource-server/dpop-tokens.html`).
  - [x] Task 29.4. The reactive/WebFlux equivalents in one short closing section.
  - [x] Task 29.5. Verify every class/property name and `grant_type` URI against
        https://docs.spring.io/spring-security/reference/ and
        https://docs.spring.io/spring-authorization-server/reference/ before writing — do not carry names over
        from memory.
- [x] Task 30. `spring-boot-authentication-methods.adoc` — "Spring Boot Authentication Methods"
  - [x] Task 30.1. Scope the page to a service running its **own** authorization server. Form login and
        `DaoAuthenticationProvider` — link the existing credentials section of
        `xref:backend/springboot/spring-security.adoc` rather than restating it.
  - [x] Task 30.2. **Mirror Task 26's two axes, not one flat list.** Open the page with *two* mapping tables:
        (a) passwordless **primary** methods (Task 26.3) → Spring API → reference doc, and (b) **additional
        2FA/MFA layers** (Task 26.4) → Spring API → reference doc. Every row is either a named Spring mechanism
        or an explicit "not built in — here is the extension point". Carry over Task 26.1's rule verbatim so the
        Spring page cannot re-blur it: enabling `mfa()` on a password login does not make it passwordless.
  - [x] Task 30.3. **One-time token login** (`oneTimeTokenLogin()`) — the Spring mechanism behind Tasks 26.3.1
        and 26.3.2 as a *primary* factor, and behind Task 26.4.2 when the same token is demanded as a *second*
        factor: the default `OneTimeTokenService` and its token store, a custom `OneTimeTokenService`, the
        generate/submit endpoints, and wiring e-mail or SMS delivery
        (`OneTimeTokenGenerationSuccessHandler`). Cover single-use and TTL enforcement, and rate limiting as an
        application concern Spring does not solve for you.
  - [x] Task 30.4. **Passkeys** (`webAuthn()`) — the Spring mechanism behind Task 26.3.5: relying-party
        id/name/allowed-origins config, registration at `/webauthn/register`, the credential repositories
        (`PublicKeyCredentialUserEntityRepository` / `UserCredentialRepository`) and persisting them, and the
        default login page's passkey support.
  - [x] Task 30.5. **Multi-factor authentication** in Spring Security 7 (`mfa()` /
        `@EnableMultiFactorAuthentication`, factor authorities, the redirect-between-factor-pages behaviour) —
        including the "passkey **and** one-time token, no password" combination, which is how Spring expresses a
        fully passwordless multi-factor login.
  - [x] Task 30.6. **Device trust** (Task 26.3.6): what `rememberMe()` actually is — a long-lived bearer cookie,
        not a device-bound key — its caveats, and what it may and may not be allowed to skip (in Spring it
        suppresses a *factor*, so say which). Then state plainly that **TOTP/HOTP, SMS OTP and push approval**
        (Tasks 26.3.3–26.3.4 as primary factors, Tasks 26.4.1–26.4.3 as second factors) have **no built-in
        Spring Security support** in either role, and point at the extension points (a custom
        `AuthenticationProvider` / `AuthenticationFilter`, or a factor plugged into `mfa()`) plus the usual
        third-party libraries — rather than implying a starter exists.
  - [x] Task 30.7. **Federated/social login as passwordless** (Task 26.3.7) — `xref:`
        `backend/springboot/spring-security-authorization-server.adoc`, which already documents `oauth2Login()`;
        do not restate it.
  - [x] Task 30.8. How to surface the result as `amr` / `acr` / `auth_time` claims through an
        `OAuth2TokenCustomizer` so downstream clients and resource servers can enforce step-up — using the same
        RFC 8176 `amr` values listed in Task 26.8; `xref:`
        `authentication-methods-2fa-and-passwordless.adoc`.
  - [x] Task 30.9. **Verify every API shape against the live docs before writing** —
        https://docs.spring.io/spring-security/reference/servlet/authentication/mfa.html ,
        `.../onetimetoken.html` and `.../passkeys.html` , plus
        https://spring.io/blog/2025/10/21/multi-factor-authentication-in-spring-security-7/ . These APIs are new
        in Spring Security 7 and must not be written from memory; in particular, confirm every class named in
        Tasks 30.3–30.4 still carries that name in 7.1.x before using it.

### Group 10 — Landing page and cheat-sheet page (Parallelizable: yes)

Depends on Groups 2–9: both pages enumerate and cross-reference every topic page by its final title.

- [x] Task 31. `index.adoc` — "OAuth Reference" landing page
  - [x] Task 31.1. Title/description/keywords + disclaimer include; one paragraph on what OAuth is (a *delegated
        authorization* framework, not an authentication protocol); a "New here? read in this order" pointer
        (Getting Started → Flows Overview → Authorization Code and PKCE → Access and Refresh Tokens → the rest as
        needed); and a short paragraph on the relationship to the SpringBoot and GraphQL references.
  - [x] Task 31.2. `== What's covered` — one bullet per page with a one-line summary, grouped under the same
        eight headings used by Groups 2–9 (Foundations; Tokens; Flows; App types; Security; OpenID Connect and
        identity; Operating; Spring Boot integration), plus the cheat sheet. Verify the bullet count against
        `ls modules/ROOT/pages/backend/oauth/` so it matches the files actually on disk.
  - [x] Task 31.3. `== Bibliography` (anchored so `index.adoc#_bibliography` resolves — this is what every page's
        disclaimer links to). Group it exactly as issue #129 specifies: IETF OAuth specifications; OpenID
        Foundation specifications; authentication-factor standards (RFC 6238/4226, W3C WebAuthn L3, FIDO
        Alliance, NIST SP 800-63B); framework documentation (Spring Security, Spring Authorization Server, Spring
        Boot, the Spring MFA blog post); provider documentation (Google, Microsoft Entra, Apple, GitHub); and the
        consulted book. Every entry linked.
  - [x] Task 31.4. List **Boyd, Ryan. _Getting Started with OAuth 2.0_. O'Reilly Media, 2012. ISBN
        978-1-449-31160-5** (https://www.oreilly.com/library/view/getting-started-with/9781449317843/) as a
        consulted reference only, stating that it predates RFC 6749 by eight months and that its
        implicit/ROPC/WebView recommendations are reversed by current practice. Close the bibliography with the
        house-style note: on any discrepancy, or wherever it is silent on something standardised after 2012, the
        RFCs and the OpenID Connect specifications win.
- [x] Task 32. `cheat-sheet.adoc` — "OAuth Cheat Sheet"
  - [x] Task 32.1. Short description of what the sheet covers, mirroring
        `backend/spring-batch/cheat-sheet.adoc`'s structure.
  - [x] Task 32.2. Grouped cross-references to every topic page (same eight-way grouping as Task 31.2).
  - [x] Task 32.3. The download link: `xref:attachment$oauth-cheat-sheet.pdf[Download the OAuth Cheat Sheet
        (PDF)]`. Expect exactly one build error here until Group 11 generates the PDF — that forward reference is
        resolved by the Group 13 gate.

### Group 11 — Cheat-sheet PDF (Parallelizable: yes)

Depends on Group 10: the sheet's contents must match what `cheat-sheet.adoc` says it covers.

- [x] Task 33. Produce `modules/ROOT/attachments/oauth-cheat-sheet.pdf`
  - [x] Task 33.1. Author a throwaway print-ready A4 HTML/CSS layout (scratch directory, **not** checked in),
        visually consistent with `springboot-cheat-sheet.pdf` / `spring-batch-cheat-sheet.pdf`: dense
        multi-column colour-coded boxes, a header line and a breadcrumb footer.
  - [x] Task 33.2. Cover, per issue #129: the four roles; the endpoint list; the authorization-request and
        token-request parameter tables; the grant-type table with 2.1 status; the PKCE two-liner; the
        token-response and error-code tables; the ID vs. access vs. refresh token comparison; JWT anatomy and the
        resource-server validation checklist; introspection/revocation one-liners; client-authentication methods;
        the RFC index (number → what it adds); the Security-BCP checklist; the DPoP proof skeleton; the discovery
        document's key fields; `acr`/`amr`/`auth_time` and the step-up challenge; **two adjacent authentication
        boxes, deliberately not merged** — one listing the passwordless *primary* methods (e-mail OTP, e-mail
        magic link / single-use token, SMS OTP, push approval, passkeys, device-bound credentials, federated
        login, smart-card mTLS) and one listing the *additional 2FA/MFA layers* (TOTP/HOTP, OTP-as-second-factor,
        push-as-second-factor, hardware tokens, recovery codes), each entry carrying its RFC 8176 `amr` value and
        a phishing-resistant yes/no, with a one-line caption that a 2FA layer never makes a password login
        passwordless; and the Spring class-mapping mini-table.
  - [x] Task 33.3. **Locate a headless-capable browser first**: check for a local Chrome/Chromium
        (`/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`, `/Applications/Chromium.app/...`,
        `which chromium google-chrome`), else run `npx playwright install chromium` and use its binary. Render
        with e.g. `--headless --print-to-pdf=… --no-pdf-header-footer`, saving to
        `modules/ROOT/attachments/oauth-cheat-sheet.pdf`. If no browser can be obtained, stop and report it
        rather than checking in a placeholder.
  - [x] Task 33.4. Verify it is **exactly one A4 page** with no clipped content: `pdfinfo` reporting `Pages: 1`
        and an A4 page size, a DOM overflow probe across every box at the exact print content width, and a
        visual check of the rendered page at ≥150 dpi. Iterate on density until it fits.

### Group 12 — Site wiring and reciprocal cross-links (Parallelizable: yes)

Depends on Groups 2–11: the nav block lists every page, and the index bullet describes the finished section.

- [x] Task 34. Add the OAuth Reference nav block to `modules/ROOT/nav.adoc`
  - [x] Task 34.1. Insert `*** xref:backend/oauth/index.adoc[OAuth Reference]` followed by one `****` entry per
        page in the Group 2–9 order, ending with `**** xref:backend/oauth/cheat-sheet.adoc[Cheat Sheet (PDF)]`.
        Use the **absolute `***`/`****` levels inline**, matching the Hibernate/SpringBoot/GraphQL/Spring Batch
        blocks — not a partial, and not the depth-agnostic `*`/`**` style used under *Programming Languages*
        (see choice 2).
  - [x] Task 34.2. Place it immediately after line 606
        (`**** xref:backend/spring-batch/cheat-sheet.adoc[Cheat Sheet (PDF)]`) and before
        `** xref:apps/index.adoc[Apps]` — the append-order convention within Backend Development.
- [x] Task 35. Add the "OAuth Reference" bullet to `modules/ROOT/pages/backend/index.adoc`
  - [x] Task 35.1. Append a sixth bullet to the `== Sections` list in the same style as the existing five (an
        `xref:` link plus a one-sentence summary ending "…plus a downloadable cheat sheet").
  - [x] Task 35.2. Extend the page's own `:description:` and `:keywords:` with the OAuth vocabulary (OAuth 1.0a,
        OAuth 2.0, OAuth 2.1, OpenID Connect, PKCE, DPoP, JWT, access token, refresh token, device grant, token
        exchange, passkeys, WebAuthn, step-up authentication).
- [x] Task 36. Extend the root `modules/ROOT/pages/index.adoc` keywords
  - [x] Task 36.1. Append `OAuth, OAuth 2.0, OAuth 2.1, OpenID Connect, JWT, PKCE, DPoP, passkeys` to the
        `:keywords:` line (line 3), preserving the existing order and formatting. Do not add a project-picker
        tile or image (see choice 7).
- [x] Task 37. Add the reciprocal cross-links into the SpringBoot section
  - [x] Task 37.1. `modules/ROOT/pages/backend/springboot/spring-security.adoc` — from the "Building the
        SecurityContext from a JWT" section (~line 570) link `xref:backend/oauth/jwt-and-jose.adoc`, and from the
        "Opaque tokens" subsection (~line 674) link
        `xref:backend/oauth/opaque-tokens-introspection-and-revocation.adoc`.
  - [x] Task 37.2. `modules/ROOT/pages/backend/springboot/spring-security-authorization-server.adoc` — from the
        intro paragraph link `xref:backend/oauth/flows-overview.adoc` and
        `xref:backend/oauth/authorization-code-and-pkce.adoc`; from the "Social login" section (~line 361) link
        `xref:backend/oauth/social-login-and-federation.adoc`.
  - [x] Task 37.3. `modules/ROOT/pages/backend/springboot/index.adoc` — add the OAuth Reference to the Spring
        Security bullets (~lines 113–117) as the protocol-level companion, and mention OAuth in its `:keywords:`.
  - [x] Task 37.4. Keep every edit additive — a sentence or a parenthetical `xref:`, never a rewrite of the
        surrounding prose. These two pages are already correct; this task only adds outbound links.

### Group 13 — Build, Mermaid validation and final verification (Parallelizable: no — Task 39 verifies output that Task 38 must first make clean)

- [x] Task 38. Build the site and drive it to zero warnings, and validate every Mermaid block
  - [x] Task 38.1. Delegate the build to the `iru-gate-runner` agent so its output doesn't consume the main
        context, e.g. `Agent({description: "Build Antora site", subagent_type: "iru-gate-runner", prompt: "Run
        `npx antora antora-playbook.yml` at the repository root and report only: whether the build completed, and
        every AsciiDoc/xref warning or error with its file and line. Do not paste the full build log."})`.
  - [x] Task 38.2. Confirm **zero** `xref`/AsciiDoc warnings or errors — in particular no unresolved
        `xref:backend/oauth/*` targets, no unresolved `xref:` into `backend/springboot/*` from Task 37, no
        missing `attachment$oauth-cheat-sheet.pdf`, no missing `modules/ROOT/images/oauth-*.svg`, and a resolving
        `index.adoc#_bibliography` anchor. Fix and re-run until clean.
  - [x] Task 38.3. Delegate `npm run validate:mermaid` (`node scripts/validate-mermaid.mjs`) to the same agent
        and confirm every new `[mermaid]` block parses — this is what CI runs in
        `.github/workflows/publish.yml` and `manual_publish.yml`, so a failure here breaks the nightly publish.
- [x] Task 39. Spot-check the rendered site and walk the acceptance criteria
  - [x] Task 39.1. Spot-check `build/site`: the OAuth Reference appears in the nav under *Guides & References →
        Backend Development* after Spring Batch and before Apps; every page renders; each `[mermaid]` block
        renders as a diagram (not literal text); each `oauth-*.svg` displays; the cheat-sheet PDF downloads; and
        the section is present in the Lunr search index.
  - [x] Task 39.2. Walk issue #129's **twelve** acceptance criteria one by one and confirm each explicitly,
        including the page count (29 topic pages + `index.adoc` + `cheat-sheet.adoc`), the per-page RFC
        attribution, the "deprecated constructs shown as legacy with their replacement named" rule, the "OAuth
        2.1 flagged as a draft" rule, the no-duplication-with-the-SpringBoot-section rule plus its reciprocal
        links, and the one-A4-page cheat sheet.
  - [x] Task 39.3. Confirm the passwordless enumeration **and its separation from 2FA** are intact end to end:
        every method in Task 26.3 appears on `authentication-methods-2fa-and-passwordless.adoc` with its `amr`
        value and phishing-resistance verdict; every 2FA layer in Task 26.4 is presented as a layer and **never
        listed as a passwordless method**; the Task 26.4.6 combination matrix is present; both Task 30.2 Spring
        mapping tables exist with matching rows (including the honest "not built in" ones); and the cheat sheet
        carries the two separate boxes from Task 33.2 rather than one merged list.


## Completion notes

All 13 task groups completed on branch `feature/129`.

**Produced**

* `modules/ROOT/partials/oauth-disclaimer.adoc` (Group 1).
* 31 pages under `modules/ROOT/pages/backend/oauth/` -- 29 topic pages, `index.adoc` (with the anchored
  `== Bibliography` every page's disclaimer links to) and `cheat-sheet.adoc` (Groups 2-10). ~9,900 lines.
* 9 hand-authored `modules/ROOT/images/oauth-*.svg` figures and 21 `[mermaid]` blocks (Groups 2-9).
* `modules/ROOT/attachments/oauth-cheat-sheet.pdf` -- 24 colour-coded boxes across 4 columns, rendered from a
  throwaway HTML/CSS layout in the scratch directory (not checked in) with headless Google Chrome (Group 11).
* Site wiring and reciprocal cross-links (Group 12).

**Gate results (Group 13)**

* `npx antora antora-playbook.yml` -- exit 0 with a **completely empty log**: zero AsciiDoc/xref warnings or
  errors. Five issues found on the first run were fixed before this result: a 3-cell table row under a
  `cols="1,3"` spec in `id-tokens-vs-access-tokens.adoc`, and five unescaped `{...}` attribute references
  (`{kid}`, `{port}`, `{tenant-id}`, `{tid}`, `{registrationId}`) across four pages.
* `npm run validate:mermaid` -- exit 0, "All 248 Mermaid diagrams parsed successfully" (21 of them new).
* Cheat-sheet PDF -- `pdfinfo` reports `Pages: 1`, `594.96 x 841.92 pts (A4)`; `pdftotext -f 2` errors as
  expected; inspected at 150 dpi and 240 dpi. Three layout defects were fixed by iteration: the last box
  overlapped the fixed footer (bottom page margin raised to 7.5mm), ordinary words broke mid-token
  ("Acces s", "Refres h", "Discove ry" -- `overflow-wrap` narrowed to code/pre only), and long Spring
  identifiers were clipped in the last column (`td:last-child code` allowed to wrap). Density settled at
  `--fs: 6.2pt`; 6.6pt and above paginate to two pages.

**Rendered-site spot check (Task 39.1)**

31 HTML pages built; nav renders *Backend Development -> Hibernate -> SpringBoot -> GraphQL -> Spring Batch ->
**OAuth Reference** -> Apps*; 9 SVGs and 21 Mermaid diagrams render; `_attachments/oauth-cheat-sheet.pdf`
resolves; 31 OAuth entries in the Lunr search index; the reciprocal body links were verified inside the
`<article>` element of each of the four edited pages (not merely in the sidebar nav).

**Out-of-scope change reverted**

`iru-check-security` regenerated `.secrets.baseline` during the run, adding one unaudited entry for
`modules/ROOT/pages/programming-languages/swift/type-casting-and-reflection.adoc:179`. That line is
`var secret = "hidden"` -- a Swift struct field in a reflection example on a page that already exists on
`main` (commit `eeaa1ea1`, issue #111), not a credential and not in any file this branch touches. The baseline
change was reverted to keep this PR scoped to issue #129; the pre-existing false positive is left for separate
triage.
