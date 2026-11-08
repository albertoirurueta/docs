# Implementation Plan: Authorization Server from Scratch docs (2/4): password storage, signing keys / JWS / JWT, tokens, registered clients, resource server, login pages, BFF, MFA and TOTP pages (issue #344)

## Task summary

Source: GitHub issue #344
Base branch: main

Issue [#344](https://github.com/albertoirurueta/docs/issues/344) (part of umbrella #159, second of four docs issues) asks for nine new pages in
`modules/ROOT/pages/backend/springboot/authorization-server-from-scratch/`, each written from the tested code of
[albertoirurueta/irurueta-auth-server](https://github.com/albertoirurueta/irurueta-auth-server) (code issues #2, #3 and #4, all merged) and
including that code only through `include::irurueta-auth-server::example$<module>/src/…[tag=…]`:

`password-storage`, `signing-keys-jws-and-jwt`, `access-refresh-and-id-tokens`, `registered-clients`, `resource-server`,
`login-and-consent-pages`, `backend-for-frontend`, `multi-factor-authentication`, `totp-and-recovery-codes`.

It also asks for their nav lines, an extension of `data-model.adoc`, the new figure `springboot-authz-key-rotation.svg` (and
`springboot-authz-bff-topology.svg` only if the existing BFF topology diagram does not fit), Mermaid diagrams, a MathJax block for the RFC 6238
time-step formula, and a clean build and `CLAUDE.md` verification.

### Choices made on the user's behalf

1. **Pages follow the real code, not the issue's sketch** (same rule as #343). The example is a hexagonal multi-module build per application, so include
   paths are the Collector `into:` targets, for example
   `example$auth-server/api/web/src/main/java/com/irurueta/authserver/authorization/api/web/password/PasswordConfiguration.java[tag=password-encoder]`.
2. **Table names come from the migrations, not from the issue.** The issue lists `totp_secrets`, `spring_session*` and `security_events` together; the code has
   `totp_credentials` and `recovery_codes` (V410), `second_factor_attempts` and `security_events` (V400), `trusted_devices` (V420), `signing_keys` (V210),
   `consumed_refresh_tokens` (V230), `created_at` on `oauth2_authorization` (V240), the account / reset-token tables (V200) and `spring_session*` in the **separate `bff` database** (V300).
   `data-model.adoc` already has a "later pages" table that assigns the V210, V230, V240, V300, V400, V410 and V420 rows to #344: those rows become real sections and the table keeps only the #345 and #336 rows.
3. **Tests sections only include tagged code.** Only `ClientAdminIT`, `MfaPasswordOnlyForcedIT`, `TotpApiIT` and `TrustedDeviceIT` carry tags. Pages whose tests have no tag
   describe the test in prose (class name, what it proves) and never paste it. A missing tag that a page really needs goes on the follow-up list (see Task 14), not into pasted code.
4. **Scope guard.** Only the nine pages, their nav lines, the `data-model.adoc` extension and the SVGs. `index.adoc`, back-links, bibliography and the API reference are #336.
5. **Figure style.** New SVGs follow `springboot-authz-architecture.svg` (plain `viewBox`, white background rect, Helvetica text, dashed boundary boxes), as #343 did.
6. **Tasks are untagged**: no installed `*-code-one-task` key fits AsciiDoc / SVG / Mermaid authoring, so tasks are implemented directly.
7. **Official docs are verified before writing.** Spring Boot 4.1 / Spring Security 7.1 names and URLs are checked against the current reference for each page (Spring Security reference,
   Spring Authorization Server section inside it, Spring Session, RFCs) before a link is added. Outdated names are not copied from memory.

Open clarifications: none

## Acceptance criteria coverage

| # | Criterion | Covered by tasks |
|---|---|---|
| 1 | "Nine pages + nav lines + `data-model.adoc` update." | Task 1, Task 2, Task 3, Task 4, Task 5, Task 6, Task 7, Task 8, Task 9, Task 10, Task 11 |
| 2 | "Every listing is an `example$` include followed by an official link." | Task 1 to Task 9, Task 13 |
| 3 | "`npx antora --fetch` is clean." | Task 12 |
| 4 | "The `CLAUDE.md` greps (image macros, inline code on `build/site/…/authorization-server-from-scratch`)… are clean." | Task 12 |
| 5 | "`npm run validate:mermaid` [is] clean." | Task 12 |
| 6 | "Every new SVG is referenced." | Task 2, Task 7, Task 12 |
| 7 | derived: every page follows the 8-step page shape from #159 and lists the Spring types to implement vs. configure | Task 1 to Task 9 |
| 8 | derived: the nine nav lines nest under *Authorization Server & Social Login* in the order given in #159, and no other nav line is added | Task 11 |
| 9 | derived: every `tag=` used by an include exists in the example at the cited path | Task 13 |

## Current code state

- **Docs repo.** `modules/ROOT/pages/backend/springboot/authorization-server-from-scratch/` holds `architecture.adoc`, `project-setup.adoc` and `data-model.adoc` (from #343, merged as 37b62b821).
  Page style: title `= Authorization Server from Scratch: <Topic>`, `:description:`, `:keywords:`, blank line, `include::partial$springboot-disclaimer.adoc[]`, then prose with `xref:` to
  `backend/oauth/*` for theory and `include::irurueta-auth-server::example$…[tag=…]` listings followed by an official link. `modules/ROOT/nav.adoc:1453-1455` holds the three existing lines under
  `**** xref:backend/springboot/spring-security-authorization-server.adoc[Authorization Server & Social Login]`. `antora-playbook.yml` pulls `irurueta-auth-server` from `main`
  (`start_path: docs`) with `@antora/collector-extension`. There is no `index.adoc` for the section yet (#336), so nav lines are the only entry point.
- **Figures.** `modules/ROOT/images/springboot-authz-architecture.svg` exists. Reusable: `oauth-jwt-anatomy.svg`, `oauth-authentication-factors.svg`. New: `springboot-authz-key-rotation.svg`;
  `springboot-authz-bff-topology.svg` only if needed.
- **`data-model.adoc`** (314 lines): erDiagram of `users`, `user_authorities`, `user_passwords` and the three Spring Authorization Server tables; Flyway layout table; a final
  `== Tables added by later pages` table with one row per migration V200 to V800 (rows V210, V230, V240, V300, V400, V410, V420 point at #344).
- **xref targets verified:** `backend/springboot/spring-security-authorization-server.adoc#_registered_clients` (heading at line 162),
  `backend/springboot/spring-security.adoc#_building_the_securitycontext_from_a_jwt` (heading at line 570), `backend/oauth/spring-boot-authentication-methods.adoc#_multi_factor_authentication` (line 203),
  `backend/oauth/authentication-methods-2fa-and-passwordless.adoc` (sections *TOTP / HOTP authenticator apps*, line 370, and *Enrolment and account recovery: the weakest link*, line 682).
- **Example repo** (`albertoirurueta/irurueta-auth-server`, `main`, 77b11fd; a depth-1 clone is at the session scratchpad `…/scratchpad/ex`, re-clone with `git clone --depth 1` if it is gone). Its own `.archive/implementation_plan_2.md`,
  `_3.md` and `_4.md` state the scope of each page. Tags per page (path prefix `auth-server/…/com/irurueta/authserver/authorization/` omitted):
  - Passwords: `api/web/password/PasswordConfiguration` (`password-encoder`), `CompromisedPasswordConfiguration` (`password-compromised-check`), `PasswordAuthenticationConfiguration` (`password-authentication-provider`),
    `UserAccountUserDetailsService` + `application/password/UpgradePasswordHashUseCase` (`password-upgrade`), `domain/password/PasswordPolicy` (`password-policy`),
    `infrastructure/persistence/password/JdbcUserAccountRepository` + `UserAccountRowMapper` (`password-load-user`), account flows `application/account/*` (`account-register`, `account-reset`, `account-reset-password`).
  - Keys / JWT: `infrastructure/keys/` `NimbusSignedTokenService` (`jwt-service`), `DatabaseJwkSourceConfiguration` + `SigningKeyJwkMapper` (`keys-jwk-source`), `AesGcmKeyCipher` + `KeyEncryptionProperties` + `RsaSigningKeyGenerator` (`keys-encryption`),
    `PurposeKeyDerivation` (`keys-purpose-derivation`); `application/keys/RotateSigningKeysUseCase` (`keys-rotation`), `SigningKeyRetention` (`keys-retention`); `persistence/keys/JdbcSigningKeyRepository` (`keys-rotation-lock`);
    `V210__signing_keys.sql` (`keys-schema`); OpenAPI `keys-api`, `keys-schemas`.
  - Tokens: `api/web/tokens/` `IssuedTokenClaims` (`tokens-claims`), `JwtClaimsContributor` (`tokens-contributor`), `RolesTenantAudienceTokenCustomizer` (`tokens-customizer`), `ReferenceTokenClaimsCustomizer` (`tokens-reference-customizer`),
    `UserInfoConfiguration` / `UserInfoMapper` (`tokens-userinfo-registration`, `tokens-userinfo`); `persistence/clients/RegisteredClientMapper` (`tokens-settings`); `persistence/tokens/ReuseDetectingAuthorizationService` and
    `V230__consumed_refresh_tokens.sql` (`tokens-reuse-detection`); `V240` (`tokens-authorization-created`).
  - Clients: `application/clients/DefaultClientDefinitions` (`clients-seed`), `CreateClientUseCase` (`clients-admin`), `persistence/clients/JdbcAuthorizationServerConfiguration` (`jdbc-services`), `RegisteredClientMapper` + `ClientJwksParser` (`clients-auth-settings`),
    `api/web/clients/DynamicClientRegistrationConfiguration` (`clients-dynamic-registration`), `ClientAdminIT` (`clients-auth-settings`), `application.yml` (`clients-seed-config`), OpenAPI `clients-api`, `clients-schemas`.
  - Resource server: `resource-server/api/web/security/SecurityConfig` (`resource-server-security`, `resource-server-converter`, `resource-server-bound-tokens`, `resource-server-step-up-beans`), `DocumentController` (`resource-server-documents`, `resource-server-method-security`),
    `application/documents/DeleteDocumentUseCase` (`resource-server-delete-ownership`), step-up `StepUpAuthorizationManager`, `StepUpAccessDeniedHandler`, `StepUpProperties`, OpenAPI `resource-server-documents-api`.
  - Login / consent / logout: `api/web/login/` `LoginController` (`login-controller`), `LoginContentSecurityPolicy` (`login-csp`), `LoginHeadersCustomizer` (`login-headers`), `BrandingProperties` (`login-branding`); `consent/ConsentController` (`consent-controller`);
    `logout/LogoutChainCustomizer` (`logout-config`); `pages/PageRenderer` (`page-renderer`); Thymeleaf `login.html` (`login-page`), `password.html` (`login-form`), `fragments/layout.html` (`login-layout`), `consent.html` (`consent-page`), `logout.html` (`logout-page`);
    OpenAPI pages (`login-page-api`, `consent-page-api`, `logout-page-api`).
  - BFF: `bff/api/web/security/SecurityConfig` (`bff-security`, `bff-logout`, `bff-authorized-client`), `login/BffLoginController` (`bff-login`), `ReturnToAuthenticationSuccessHandler` (`bff-login-success`), `logout/LogoutConfiguration` (`bff-logout-handler`),
    `user/UserController` (`bff-user`), `infrastructure/resourceserver/ResourceServerClientConfiguration` (`bff-relay`, `bff-documents-client`), `infrastructure/session/SessionConfiguration` (`bff-session`), `V300__spring_session.sql` (`bff-session-schema`),
    `static/index.html` (`bff-spa`), `static/assets/app.js` (`bff-spa-js`), OpenAPI `bff-user-api`, `bff-login-api`, `bff-documents-api`.
  - MFA: `api/web/mfa/` `FactorTimeline` (`mfa-factor-timeline`), `MfaClaimsContributor` (`mfa-claims`), `SecondFactorController` (`mfa-second-factor-page`), `SecondFactorFragment` (`mfa-second-factor-fragment`), `StepUpAuthorizationRequestConverter` (`mfa-step-up-converter`),
    `StepUpGuard` (`mfa-step-up-guard`), `MfaExceptionHandler` (`mfa-step-up-challenge`), `TrustedDeviceFactor` / `TrustedDeviceFilter` (`mfa-trusted-device-factor`, `mfa-trusted-device-filter`); `application/mfa/` `IsClientMfaRequiredUseCase`, `IsUserMfaRequiredUseCase`,
    `CheckSecondFactorLockoutUseCase`, `FindTrustedDeviceUseCase`, `MfaProperties`; `domain/mfa/TrustedDeviceTokenSigner` (`mfa-trusted-device-signer`); `infrastructure/keys/HmacTrustedDeviceTokenSigner` (`mfa-trusted-device-signature`);
    `persistence/mfa/JdbcSecondFactorAttemptRepository` (`mfa-lock-attempts`, `mfa-record-failure`); `V400` (`mfa-schema-events`), `V420` (`mfa-schema-trusted-devices`); `second-factor.html` (`mfa-second-factor-page-template`);
    ITs `MfaPasswordOnlyForcedIT` (`mfa-enrolment-in-login-it`), `TrustedDeviceIT` (`mfa-trusted-device-it`), `TotpApiIT` (`mfa-step-up-api-it`); OpenAPI `mfa-step-up-response`.
  - TOTP / recovery: `api/web/totp/` `TotpAuthenticationFilter` + `TotpAuthenticationProvider` (`totp-filter`), `TotpChainCustomizer` (`totp-session-strategy`), `TotpController` (`totp-enrollment`), `TotpSecondFactorFragment` (`totp-second-factor-fragment`),
    `RecoveryCodesPageController` (`totp-recovery-codes-page`); `application/totp/` `ConfirmTotpAtSignInUseCase` (`totp-sign-in-enrolment`), `DisableTotpUseCase` (`totp-disable`); `V410__totp_recovery_codes.sql` (`totp-schema`);
    templates `totp.html` (`totp-form`, `totp-enrolment-form`, `totp-low-codes`), `recovery-codes.html` (`totp-recovery-codes-template`); OpenAPI `totp-api-contract`, `totp-schemas`, `totp-recovery-codes-page-api`.
    The RFC 6238 / 4226 algorithm itself has no tag here: check the example for the class that computes it (probably in `domain/totp/`) and add it to the follow-up list in Task 14 if it is untagged.
- **Verification tooling.** `scripts/validate-mermaid.mjs` (`npm run validate:mermaid`, needs a one-off `npm i --no-save mermaid@11 jsdom`); the `CLAUDE.md` greps for image macros and inline code.

## Implementation steps

### Group 1 (Parallelizable: yes — one new file each; Task 2 and Task 7 also add one SVG each; Task 10 edits only `data-model.adoc`; no two tasks edit the same file)

Common rules for every page task (do not skip any):

- Header as in `architecture.adoc` (title, `:description:`, `:keywords:`, disclaimer partial). Follow the 8-step page shape from #159: *What you build* (with the `xref:` to the OAuth Reference theory),
  *How it works* (Mermaid), *Spring building blocks* (table: type, **implement** or **configure**, what it does, link to Javadoc or reference), *Data*, *Code* (includes), *API*, *Tests*, *Security notes and pitfalls*.
  Omit a step only if it truly does not apply to the page and say so in one line.
- Every listing: `[source,java]` (or `html`, `yaml`, `sql`, `js` as fitting) with a single `include::irurueta-auth-server::example$<path>[tag=<tag>]` and, immediately after, one link to the official page it derives from.
  Before writing, read each tagged region in the example repo and write prose that matches what it really does; never paste code.
- `xref:` to the OAuth Reference for theory instead of repeating it; do not `xref:` pages that belong to #345 or #336 (they do not exist yet): name them in prose only.
- `CLAUDE.md` rules: image and inline-image macros on one line, alt text in double quotes when it has a comma, block macros at column 0; inline code containing `->`, `=>`, `{`, `*`, `~`, `^`, `...`, `'`, `__` as `+…+`, code containing `+` as `pass:c[…]`;
  Mermaid stereotypes as `&lt;&lt;…&gt;&gt;`.
- Mermaid diagrams are checked against the code they describe (class and endpoint names, order of steps).

- [x] Task 1. Write `password-storage.adoc` (documents irurueta-auth-server#2, passwords)
  - File: `modules/ROOT/pages/backend/springboot/authorization-server-from-scratch/password-storage.adoc`. Title "Storing Passwords Securely".
  - [x] Task 1.1. *What you build* and *How it works*: `DelegatingPasswordEncoder` with `{id}` prefixes, Argon2id vs. bcrypt choice, `PasswordPolicy`, compromised-password check. `xref:backend/oauth/authentication-methods-2fa-and-passwordless.adoc[]` for passwords as the baseline;
    link the OWASP Password Storage Cheat Sheet, NIST SP 800-63B-4 and the Spring Security *Password Storage* reference.
  - [x] Task 1.2. A table "encoder → parameters → when to use it" built from `PasswordConfiguration` and `application.yml` values actually used (do not invent parameters), covering at least Argon2id, bcrypt, PBKDF2 and scrypt as Spring encoders and `NoOp` as never.
  - [x] Task 1.3. Mermaid `sequenceDiagram` of the upgrade-on-login flow (`UserAccountUserDetailsService` → `UpgradePasswordHashUseCase`, `UserDetailsPasswordService`), checked against the `password-upgrade` regions.
  - [x] Task 1.4. Spring building blocks table (`PasswordEncoder`, `DelegatingPasswordEncoder`, `UserDetailsPasswordService`, `CompromisedPasswordChecker` / `HaveIBeenPwnedRestApiPasswordChecker`, `DaoAuthenticationProvider`, `AuthenticationProvider`) with implement vs. configure.
  - [x] Task 1.5. Includes: `password-encoder`, `password-compromised-check`, `password-authentication-provider`, `password-upgrade` (both files), `password-policy`, `password-load-user`; account flows `account-register`, `account-reset`, `account-reset-password`
    for registration and the reset-token flow, plus `account-schema` (V200) in *Data*; each followed by an official link. *API*: the `/api/account/**` password endpoints from the `account-api` OpenAPI tag, as `curl` examples that match the contract.
  - [x] Task 1.6. *Security notes*: enumeration on reset and login, timing, rate limiting (`AccountRateLimiter`, `account-rate-limit`), token single use (`account-token-consume`), pepper and migration between encoders. *Tests*: describe in prose the tests covering encoder upgrade and reset (read the example's test classes).
- [x] Task 2. Write `signing-keys-jws-and-jwt.adoc` and `springboot-authz-key-rotation.svg` (documents irurueta-auth-server#2, keys and `JwtEncoder`)
  - Files: `…/signing-keys-jws-and-jwt.adoc`, `modules/ROOT/images/springboot-authz-key-rotation.svg`. Title "Signing Keys, JWS & JWT".
  - [x] Task 2.1. Create `springboot-authz-key-rotation.svg`: a timeline of key states (generated / active / retired but still published / removed) against the access-token TTL, with the overlap window that keeps tokens signed by a retired key verifiable. Take state names and the retention rule from
    `RotateSigningKeysUseCase`, `SigningKeyRetention` and `V210`, and the TTL from the seeded token settings; do not draw numbers the code does not use. Same style as `springboot-authz-architecture.svg`.
  - [x] Task 2.2. Page: reuse `oauth-jwt-anatomy.svg` via a one-line `image::oauth-jwt-anatomy.svg[…]` macro, `xref:backend/oauth/jwt-and-jose.adoc[]` for JOSE theory, the new SVG for rotation, a KMS / HSM alternatives section in prose (AWS KMS, Google Cloud KMS, Azure Key Vault, PKCS#11 HSM; what changes in the `JWKSource`).
  - [x] Task 2.3. Includes: `keys-schema` (V210), `keys-encryption` (`AesGcmKeyCipher`, `RsaSigningKeyGenerator`, `KeyEncryptionProperties`), `keys-purpose-derivation`, `keys-jwk-source`, `keys-rotation`, `keys-retention`, `keys-rotation-lock`, `jwt-service` (the `JwtEncoder` / `NimbusSignedTokenService`), each followed by an official link
    (Spring Security reference, Nimbus JOSE + JWT, RFC 7515 / 7517 / 7519).
  - [x] Task 2.4. Mermaid `sequenceDiagram` of rotation (admin API or schedule → generate → encrypt → insert with lock → JWKS publishes both keys), Spring building blocks table (`JWKSource<SecurityContext>`, `JwtEncoder`, `NimbusJwtEncoder`, `JwtDecoder`, `OAuth2TokenCustomizer`, `BytesEncryptor`),
    *API* from `keys-api` / `keys-schemas` (`/api/admin/keys` rotation, `/oauth2/jwks`), *Security notes* (never generate per startup in production, `kid`, algorithm pinning, encryption at rest, backup).
- [x] Task 3. Write `access-refresh-and-id-tokens.adoc` (documents irurueta-auth-server#2, tokens)
  - File: `…/access-refresh-and-id-tokens.adoc`. Title "Access, Refresh & ID Tokens".
  - [x] Task 3.1. `xref:` to `access-and-refresh-tokens.adoc`, `id-tokens-vs-access-tokens.adoc`, `opaque-tokens-introspection-and-revocation.adoc` (all under `backend/oauth/`). A table of token formats and lifetimes **taken from `tokens-settings` and the seeded clients**, not from defaults.
  - [x] Task 3.2. Includes: `tokens-claims`, `tokens-contributor`, `tokens-customizer`, `tokens-reference-customizer`, `tokens-userinfo-registration`, `tokens-userinfo`, `tokens-settings`, `tokens-reuse-detection` (Java and the V230 SQL), `tokens-authorization-created` (V240); each followed by an official link.
  - [x] Task 3.3. Mermaid `sequenceDiagram` of refresh rotation and reuse detection (valid refresh → new pair → replay of the old token → family revoked), checked against `ReuseDetectingAuthorizationService`; a second small diagram only if useful (reference vs. self-contained token).
  - [x] Task 3.4. Spring building blocks (`OAuth2TokenCustomizer<JwtEncodingContext>`, `OAuth2TokenGenerator`, `OAuth2AuthorizationService`, `OAuth2TokenFormat`, `TokenSettings`, `OidcUserInfoMapper`), *Data* (`oauth2_authorization`, `consumed_refresh_tokens`, `created_at`),
    *API* (`/oauth2/token`, `/oauth2/revoke`, `/oauth2/introspect`, `/userinfo` with request and response examples), *Security notes* (rotation for public clients, cleanup of abandoned authorizations, revocation, claim minimisation).
- [x] Task 4. Write `registered-clients.adoc` (documents irurueta-auth-server#2, clients and admin API)
  - File: `…/registered-clients.adoc`. Title "Registered Clients & Client Management".
  - [x] Task 4.1. Build a table of the example's clients and their settings **by reading `DefaultClientDefinitions` (`clients-seed`) and the `clients-seed-config` region of `application.yml`**: client id, type (confidential / public), authentication method, grant types, scopes, PKCE and consent requirements, token settings.
    Do not print secret values beyond what the seed tag itself shows.
  - [x] Task 4.2. `xref:backend/springboot/spring-security-authorization-server.adoc#_registered_clients[]` and `xref:backend/oauth/discovery-metadata-and-client-registration.adoc[]`. Includes: `clients-seed`, `clients-admin`, `jdbc-services`, `clients-auth-settings` (mapper, parser, and the `ClientAdminIT` region), `clients-dynamic-registration`,
    each followed by an official link. Mermaid flow of admin create / update (`/api/admin/clients`) if it clarifies, otherwise a short list.
  - [x] Task 4.3. Spring building blocks (`RegisteredClient`, `RegisteredClientRepository`, `JdbcRegisteredClientRepository`, `ClientSettings`, `TokenSettings`, `OAuth2AuthorizationServerConfigurer` registration endpoint), *API* from `clients-api` / `clients-schemas`
    (`curl` create, list, update, rotate secret), *Tests* (`ClientAdminIT`), *Security notes* (exact redirect URIs, secrets stored encoded, public clients need PKCE, who may call the admin API).
- [x] Task 5. Write `resource-server.adoc` (documents irurueta-auth-server#2, resource server)
  - File: `…/resource-server.adoc`. Title "Protecting APIs: the Resource Server".
  - [x] Task 5.1. `xref:backend/springboot/spring-security.adoc#_building_the_securitycontext_from_a_jwt[]`. Mermaid flow of JWT validation (signature via JWKS, `iss`, `exp`, `aud`, scope-to-authority conversion, method security, ownership check), checked against the `resource-server-*` regions.
  - [x] Task 5.2. Includes: `resource-server-security`, `resource-server-converter`, `resource-server-bound-tokens`, `resource-server-step-up-beans`, `resource-server-step-up` (`StepUpAuthorizationManager`), `resource-server-step-up-handler`, `resource-server-step-up-properties`,
    `resource-server-documents`, `resource-server-method-security`, `resource-server-delete-ownership`, each followed by an official link. Where an include belongs to a feature explained on a #345 page (sender-constrained tokens), keep the explanation to what the code does here and name the later page in prose.
  - [x] Task 5.3. Spring building blocks (`SecurityFilterChain`, `JwtDecoder`, `JwtAuthenticationConverter`, `OAuth2TokenValidator<Jwt>`, `@PreAuthorize`, `AuthorizationManager`, `AccessDeniedHandler`, `BearerTokenAuthenticationEntryPoint`),
    *API* from `resource-server-documents-api` (`curl` with a bearer token and the expected `401` / `403` with `WWW-Authenticate`), *Security notes* (audience check, clock skew, JWKS caching, step-up challenge `insufficient_user_authentication`).
- [x] Task 6. Write `login-and-consent-pages.adoc` (documents irurueta-auth-server#3, pages)
  - File: `…/login-and-consent-pages.adoc`. Title "Login, Consent & Logout Pages".
  - [x] Task 6.1. `xref:backend/oauth/logout-and-session-management.adoc[]` and `xref:web/thymeleaf/spring-security-integration.adoc[]`. Mermaid `sequenceDiagram` of login → consent → redirect with the code, and a small one for RP-initiated logout, checked against `LoginController`, `ConsentController`, `LogoutChainCustomizer`.
    Screenshots are optional: use none, or a small SVG mock referenced by a one-line macro (then name it `springboot-authz-login-pages.svg` and reference it).
  - [x] Task 6.2. Includes: `login-controller`, `login-page`, `login-form`, `login-layout`, `login-csp`, `login-headers`, `login-branding`, `consent-controller`, `consent-page`, `logout-config`, `logout-page`, `page-renderer`, each followed by an official link
    (Spring Security custom login, Spring Authorization Server consent, Thymeleaf).
  - [x] Task 6.3. Spring building blocks (`formLogin().loginPage()`, `AuthenticationSuccessHandler`, `OAuth2AuthorizationConsentService`, `LogoutSuccessHandler`, `OidcClientInitiatedLogoutSuccessHandler` or the code's equivalent, `RequestCache`), *API* from the `login-page-api`, `consent-page-api`, `logout-page-api` tags,
    *Security notes* (CSP and headers with a table of what each header stops, CSRF on forms, open-redirect on `continue`, clickjacking, the extension point for later methods: login fragments, named in prose with no `xref:` to #345 pages).
- [x] Task 7. Write `backend-for-frontend.adoc` (documents irurueta-auth-server#3, BFF and SPA)
  - Files: `…/backend-for-frontend.adoc`, and `modules/ROOT/images/springboot-authz-bff-topology.svg` **only if** the topology diagram of `backend/oauth/browser-based-apps.adoc` does not fit.
  - [x] Task 7.1. Read `browser-based-apps.adoc`'s topology figure. If it fits (browser, BFF, authorization server, resource server, cookie vs. token), reuse it with a one-line macro; otherwise create `springboot-authz-bff-topology.svg` in the architecture figure's style, using the real ports and the `__Host-` cookie from `bff-session`, and reference it.
  - [x] Task 7.2. Mermaid diagrams: sign-in (SPA → `/bff/login` → `/oauth2/authorization/…` → authorization server → code → token request → session cookie), an API call (`/api/**` relayed with the access token), and logout (`/bff/logout` → RP-initiated logout), each checked against the `bff-*` regions.
  - [x] Task 7.3. Includes: `bff-security`, `bff-authorized-client`, `bff-logout`, `bff-login`, `bff-login-success`, `bff-logout-handler`, `bff-user`, `bff-relay`, `bff-documents-client`, `bff-session`, `bff-session-schema` (V300, in the **bff** database), `bff-spa`, `bff-spa-js`,
    each followed by an official link (Spring Security OAuth2 Client, Spring Session JDBC, `OAuth2ClientHttpRequestInterceptor`, the IETF *OAuth 2.0 for Browser-Based Applications* draft). If the code is a hand-written `RestClient` relay instead of Spring Cloud Gateway `TokenRelay`, say why in one paragraph.
  - [x] Task 7.4. Spring building blocks (`oauth2Login()`, `OAuth2AuthorizedClientManager`, `OAuth2AuthorizedClientRepository`, `JdbcIndexedSessionRepository`, `CookieSerializer`, `CsrfTokenRequestHandler`, `RestClient` interceptor), *API* from `bff-user-api`, `bff-login-api`, `bff-documents-api`,
    *Security notes* (tokens never reach the browser, CSRF with a SPA, cookie attributes, session fixation, refresh handling).
- [x] Task 8. Write `multi-factor-authentication.adoc` (documents irurueta-auth-server#4, MFA)
  - File: `…/multi-factor-authentication.adoc`. Title "Multi-Factor Authentication & Step-Up".
  - [x] Task 8.1. `xref:backend/oauth/authentication-methods-2fa-and-passwordless.adoc[]` (axes, `amr` values, RFC 9470) and `xref:backend/oauth/spring-boot-authentication-methods.adoc#_multi_factor_authentication[]`. Say plainly what is built in (`@EnableMultiFactorAuthentication`, `FactorGrantedAuthority`) and what the example adds.
  - [x] Task 8.2. Mermaid `sequenceDiagram`: password → second factor → consent → code, and a `stateDiagram-v2` of factor accumulation (read `FactorTimeline` and `MfaClaimsContributor`). A third small diagram for step-up (`acr_values` / `max_age` → challenge → `acr`, `amr`, `auth_time`) if it clarifies.
  - [x] Task 8.3. Includes: `mfa-properties`, `mfa-user-required`, `mfa-client-required`, `mfa-factor-timeline`, `mfa-claims`, `mfa-second-factor-page`, `mfa-second-factor-fragment`, `mfa-second-factor-page-template`, `mfa-step-up-converter`, `mfa-step-up-guard`, `mfa-step-up-challenge`,
    `mfa-lockout-check`, `mfa-lock-attempts`, `mfa-record-failure`, `mfa-trusted-device-factor`, `mfa-trusted-device-filter`, `mfa-trusted-device-signer`, `mfa-trusted-device-signature`, `mfa-find-trusted-device`, each followed by an official link.
    Group the listings by sub-heading (policy, second-factor page, step-up, lockout, trusted devices) so the page stays readable.
  - [x] Task 8.4. *Data*: `mfa-schema-events` (V400: `security_events`, `second_factor_attempts`) and `mfa-schema-trusted-devices` (V420). Spring building blocks table, *API* from `mfa-step-up-response` and `mfa-second-factor-page-api`, *Tests*: include `mfa-enrolment-in-login-it`, `mfa-trusted-device-it` and `mfa-step-up-api-it`.
    *Security notes*: downgrade attacks, lockout vs. denial of service, trusted-device token theft, step-up replay.
- [x] Task 9. Write `totp-and-recovery-codes.adoc` (documents irurueta-auth-server#4, TOTP and recovery codes)
  - File: `…/totp-and-recovery-codes.adoc`. Title "TOTP Authenticator Apps & Recovery Codes".
  - [x] Task 9.1. `xref:backend/oauth/authentication-methods-2fa-and-passwordless.adoc#_totp_hotp_authenticator_apps[]` and `…#_enrolment_and_account_recovery_the_weakest_link[]` (check both generated anchors against the headings at lines 370 and 682; fall back to the page without an anchor if they do not resolve).
    A MathJax block for the RFC 6238 time-step formula and the RFC 4226 truncation, in `\[ … \]` LaTeX as `CLAUDE.md` describes, checked in the built page.
  - [x] Task 9.2. Mermaid diagrams: enrolment (secret generated, QR / `otpauth://` URI, first code confirms, secret stored encrypted, recovery codes shown once) and verification (code, window check, replay protection, lockout).
  - [x] Task 9.3. Includes: `totp-schema` (V410), `totp-filter`, `totp-session-strategy`, `totp-enrollment`, `totp-sign-in-enrolment`, `totp-disable`, `totp-second-factor-fragment`, `totp-recovery-codes-page`, `totp-form`, `totp-enrolment-form`, `totp-low-codes`, `totp-recovery-codes-template`, `keys-encryption`
    (secrets at rest, linked from the keys page, not repeated), plus the class that computes RFC 6238 if a tag exists. Each is followed by an official link (RFC 6238, RFC 4226, Spring Security Crypto `BytesEncryptor`).
  - [x] Task 9.4. Spring building blocks, *API* from `totp-api-contract`, `totp-schemas`, `totp-recovery-codes-page-api`, *Tests* (`mfa-step-up-api-it` from `TotpApiIT` is shared with the MFA page: link it, include once), *Security notes* (clock drift window, code reuse, secret storage,
    recovery codes hashed and single use, regenerate on use, the account-recovery weakest link).
- [x] Task 10. Extend `data-model.adoc` with the tables these code issues added
  - File: `modules/ROOT/pages/backend/springboot/authorization-server-from-scratch/data-model.adoc` only.
  - [x] Task 10.1. Extend the erDiagram (or add a second, linked diagram if one becomes unreadable) with `signing_keys`, `consumed_refresh_tokens`, the V200 account and reset-token tables, `totp_credentials`, `recovery_codes`, `second_factor_attempts`, `security_events` and `trusted_devices`,
    and a **separate diagram or table section for the `bff` database** (`spring_session`, `spring_session_attributes`). Take every column from the migration with the matching tag; do not copy names from the issue.
  - [x] Task 10.2. Add column tables (or `include::…[tag=…]` of the SQL: `account-schema`, `keys-schema`, `tokens-reuse-detection`, `tokens-authorization-created`, `bff-session-schema`, `mfa-schema-events`, `totp-schema`, `mfa-schema-trusted-devices`) for each, followed by an official link where the table is Spring-defined (`spring_session*`).
  - [x] Task 10.3. In `== Tables added by later pages`, delete the V200 to V420 and V300 rows that now have a section and replace the "written under issue #344" text with an `xref:` to the page that explains each table; keep the V500 to V800 rows (#345) unchanged, still without `xref:`.
    Update the page's `:description:` / `:keywords:` and intro paragraph, which currently say that "later pages add the rest".

### Group 2 (Parallelizable: yes — a single task)

- [x] Task 11. Add the nine nav lines
  - File: `modules/ROOT/nav.adoc`. After line 1455 (`data-model.adoc`), add, at the same `*****` level and in this order, exactly the nine lines from #159: `password-storage.adoc[Storing Passwords Securely]`, `signing-keys-jws-and-jwt.adoc[Signing Keys, JWS & JWT]`,
    `access-refresh-and-id-tokens.adoc[Access, Refresh & ID Tokens]`, `registered-clients.adoc[Registered Clients & Client Management]`, `resource-server.adoc[Protecting APIs: the Resource Server]`, `login-and-consent-pages.adoc[Login, Consent & Logout Pages]`,
    `backend-for-frontend.adoc[Backend-for-Frontend (BFF)]`, `multi-factor-authentication.adoc[Multi-Factor Authentication & Step-Up]`, `totp-and-recovery-codes.adoc[TOTP Authenticator Apps & Recovery Codes]`. Add no other nav line.

### Group 3 (Parallelizable: no — verification depends on every page, the nav and the SVGs being in place)

- [x] Task 12. Build and verify
  - [x] Task 12.1. Run `npx antora --fetch antora-playbook.yml` (the build is long: run it in the background or delegate to `iru-gate-runner`). It must finish with no `xref`, include or tag warnings or errors; fix and rebuild until clean.
  - [x] Task 12.2. Run, with every `--include` pattern quoted, the three `CLAUDE.md` image greps (block macros not closed on one line; inline macros not closed; `<p>image::` in `build/site`), the unquoted-comma alt-text grep on the new `.adoc` files, and the inline-code substitution grep on
    `build/site/backend/springboot/authorization-server-from-scratch`. All must print nothing. Also scan the rendered text of the nine pages for stray backticks, `+`, `[[` and quote defects (the grep above misses them).
  - [x] Task 12.3. Run `npm i --no-save mermaid@11 jsdom` and `npm run validate:mermaid`: every diagram, including those on the nine new pages and in `data-model.adoc`, must report as parsed.
  - [x] Task 12.4. Check that every new `springboot-authz-*.svg` (key rotation, and BFF topology or login mock if created) is referenced by at least one page, and that every `image::` target in the nine pages exists in `modules/ROOT/images/`. Check the MathJax block renders (no raw `\[`) in the built TOTP page.
  - [x] Task 12.5. Open the built nine pages and `data-model.adoc` in the Browser pane and check the includes show code (not empty or "unresolved directive"), the figures render, and the Mermaid diagrams draw.
- [x] Task 13. Check every include against the example
  - [x] Task 13.1. With a script written in the scratchpad (not in the repo): for each `include::irurueta-auth-server::example$<path>[tag=<tag>]` in the nine pages and `data-model.adoc`, map `example$` to the example checkout, assert the file exists and contains both `tag::<tag>[]` and `end::<tag>[]`.
    Must report zero misses. This is independent of Antora's own warnings, which can be lenient about tags.
  - [x] Task 13.2. Check that every listing is followed by an official link, by reading each `----` block that has an `include::` and the line after it.
- [x] Task 14. Record gaps in the example
  - [x] Task 14.1. Collect every place where a page needed code, a pom or compose region, or a test that has no tag in irurueta-auth-server (for example the RFC 6238 computation class, password and key-rotation tests). List them in the PR description with file and proposed tag name.
    **Do not open issues in irurueta-auth-server without asking the user first**; offer to open one follow-up issue for the whole list.
  - [x] Task 14.2. Confirm that no code was pasted into any page that the example does not contain, and that `index.adoc`, back-links, bibliography and `api-reference` were not touched (they are #336).
