# Implementation Plan: Authorization Server from Scratch docs (3/4): passkeys, e-mail / SMS OTP, social login, other passwordless methods, implicit flow and service-to-service pages (issue #345)

## Task summary

Source: GitHub issue #345
Base branch: main

Issue [#345](https://github.com/albertoirurueta/docs/issues/345) is the third of four docs issues under umbrella #159. It asks for seven new pages in
`modules/ROOT/pages/backend/springboot/authorization-server-from-scratch/`. Each page is written from the tested code of
[albertoirurueta/irurueta-auth-server](https://github.com/albertoirurueta/irurueta-auth-server) (code issues #5, #6, #7 and #8, all merged as PRs #14 to #17).
Code is included only through `include::irurueta-auth-server::example$<module>/src/…[tag=…]`. The seven pages are:

`passkeys`, `email-otp-and-magic-links`, `sms-otp`, `social-login-and-identity-brokering`, `other-passwordless-methods`,
`implicit-flow-legacy-and-migration`, `client-credentials-and-service-to-service`.

The issue also asks for:

- the pages' nav lines;
- an extension of `data-model.adoc` with the tables these features add;
- the Mermaid diagrams and tables listed per page in the issue;
- a clean `npx antora --fetch`, clean `CLAUDE.md` greps and a clean `npm run validate:mermaid`.

Every page follows the 8-step page shape from #159: What you build, How it works, Spring building blocks, Data, Code, API, Tests, Security notes and pitfalls.

### Choices made on the user's behalf

1. **Pages follow the real code, not the issue's sketch**, as #343 and #344 did. The example is a hexagonal multi-module build per application, so include paths are the
   Collector `into:` targets of `irurueta-auth-server/docs/antora.yml`. Example:
   `example$auth-server/api/web/src/main/java/com/irurueta/authserver/authorization/api/web/passkeys/PasskeyConfiguration.java[tag=passkeys-chain-customizer]`.
2. **Table names come from the migrations, not from the issue.** The issue lists `user_entities` / `user_credentials`, `one_time_tokens`, `user_phones`, `federated_identities`
   and "any certificate or `jti` tables". The code has these migrations: `V500__webauthn.sql`, `V600__one_time_tokens.sql`, `V610__ott_codes.sql`, `V620__user_phones.sql`,
   `V630__sms_cost_ledger.sql`, `V700__federated_identities.sql`, `V701__generated_passwords.sql`, `V710__x509_certificates.sql` and `V800__client_assertion_jtis.sql`.
   The exact table names are read from each SQL file before writing.
3. **Tests sections only include tagged code.** None of this wave's tests carry a tag: `PasskeyRegistrationIT`, `OttEmailCodeIT`, `OttMagicLinkIT`, `OttSmsIT`, `SocialLoginIT`,
   `X509LoginIT`, `DeviceVerificationPageIT`, `LegacyImplicitIT`, `ImplicitRejectedIT`, `ClientAuthenticationIT`, `TokenExchangeIT`, and the `e2e-tests` classes
   `PasskeyEndToEndIT`, `OttEndToEndIT`, `DeviceFlowEndToEndIT`, `LegacyImplicitEndToEndIT`, `ClientCredentialsEndToEndIT` and `TokenExchangeEndToEndIT`.
   Each page therefore describes its tests in prose (class name, what it proves) and never pastes them. Missing tags go on the follow-up list (Task 11), not into pasted code.
4. **Push approval is design notes only.** The example has no push-approval code (irurueta-auth-server#7 scoped it as design notes). `other-passwordless-methods.adoc` covers it
   in prose with a Mermaid sequence diagram of the number-matching design, says plainly that it is not implemented, and includes no code.
5. **`V701__generated_passwords.sql` has no tag.** `data-model.adoc` and the social page describe this table with a column table read from the migration, not a pasted listing,
   and the missing tag goes on the follow-up list.
6. **Figures are Mermaid only.** The issue asks only for Mermaid diagrams and tables, so no new SVG is planned. A page may reuse an existing figure (for example
   `oauth-authentication-factors.svg`) with a one-line macro. If a task does add a `springboot-authz-<topic>.svg`, it follows the style of
   `springboot-authz-architecture.svg` and must be referenced (checked in Task 9).
7. **Scope guard.** Only the seven pages, their nav lines and the `data-model.adoc` extension are in scope. `index.adoc`, back-links, bibliography, `api-reference`,
   `hardening-and-production` and `testing` belong to #336.
8. **Tasks are untagged.** No installed `iru-*-code-one-task` key fits AsciiDoc / Mermaid authoring, so tasks are implemented directly.
9. **Official docs are verified before writing.** Spring Boot 4.1 / Spring Security 7.1 names and URLs are checked against the current references before each link is added.
   That covers the Spring Security reference (Passkeys, One-Time Token Login, OAuth 2.0 Login, X.509, the Authorization Server section), W3C WebAuthn Level 3, passkeys.dev,
   RFC 8628, RFC 7523, RFC 8705, RFC 8693, RFC 9449, RFC 9700 and NIST SP 800-63B. Names are not copied from memory, and anything Spring marks experimental is said to be experimental.

Open clarifications: none

## Acceptance criteria coverage

| # | Criterion | Covered by tasks |
|---|---|---|
| 1 | "Seven pages + nav lines + `data-model.adoc` update." | Task 1, Task 2, Task 3, Task 4, Task 5, Task 6, Task 7, Task 8 |
| 2 | "Every listing is an `example$` include followed by an official link." | Task 1 to Task 8, Task 10 |
| 3 | "`npx antora --fetch` is clean." | Task 9 |
| 4 | "The `CLAUDE.md` greps and `npm run validate:mermaid` are clean." | Task 9 |
| 5 | "Every new SVG is referenced." | Task 9 |
| 6 | derived: every page follows the 8-step page shape from #159 and has a table of Spring types to implement vs. configure | Task 1 to Task 7 |
| 7 | derived: each page has the Mermaid diagrams and tables the issue's Pages table asks for, and the implicit page opens with a prominent `WARNING` and is mostly a migration guide | Task 1 to Task 7 |
| 8 | derived: the seven nav lines nest under *Authorization Server & Social Login*, after `totp-and-recovery-codes`, in the order given in #159, and no other nav line is added | Task 8 |
| 9 | derived: every `tag=` used by an include exists in the example at the cited path, and no page contains code that the example does not | Task 10, Task 11 |

## Current code state

- **Docs repo.**
  - `modules/ROOT/pages/backend/springboot/authorization-server-from-scratch/` holds twelve pages from #343 and #344.
  - Page style follows `totp-and-recovery-codes.adoc`:
    - the title `= Authorization Server from Scratch: <Topic>`, then `:description:` and `:keywords:` (`:stem: latexmath` only if math is used);
    - a blank line, then `include::partial$springboot-disclaimer.adoc[]`;
    - the section headings `== What you build`, `== How it works`, `== Spring building blocks`, and so on;
    - Mermaid blocks written as `[mermaid]` followed by a `....` delimiter;
    - `xref:` to `backend/oauth/*` for theory;
    - `include::irurueta-auth-server::example$…[tag=…]` listings, each followed by an official link.
  - `modules/ROOT/nav.adoc:1508-1519` holds the twelve existing `*****` lines under `**** xref:backend/springboot/spring-security-authorization-server.adoc[Authorization Server & Social Login]`.
    The last of them is `totp-and-recovery-codes`.
  - `antora-playbook.yml` pulls `irurueta-auth-server` from `main` (`start_path: docs`) with `@antora/collector-extension`.
- **`data-model.adoc`** (731 lines):
  - an erDiagram and a section per table group up to V420;
  - `== The bff database: Spring Session tables` and `== Flyway layout`;
  - a final `== Tables added by later pages` table (about line 684). Its rows V500, V600, V610, V620, V630, V700, V701, V710 and V800 each say "written under issue #345".
- **xref targets verified** (files exist):
  - Under `backend/oauth/`: `authentication-methods-2fa-and-passwordless.adoc`, `social-login-and-federation.adoc`, `device-authorization-grant.adoc`, `spring-boot-flow-recipes.adoc`,
    `spring-boot-authentication-methods.adoc`, `legacy-implicit-and-password-grants.adoc`, `browser-based-apps.adoc`, `client-credentials-and-client-authentication.adoc`,
    `sender-constrained-tokens-dpop-and-mtls.adoc` and `token-exchange-and-assertion-grants.adoc`.
  - Also `backend/resilience/bucket4j-spring-boot-manual-integration.adoc` and `backend/springboot/spring-security-authorization-server.adoc`.
  - Headings to anchor on (check the generated ids in the built HTML; fall back to the page without an anchor if one does not resolve):
    - `authentication-methods-2fa-and-passwordless.adoc` lines 124 (E-mail OTP), 157 (magic link), 189 (SMS OTP), 222 (push, primary), 260 (passkeys), 335 (federated),
      352 (certificate / mTLS), 398 (OTP as a second factor), 406 (push, second factor) and 418 (passkeys as a second factor);
    - `spring-boot-authentication-methods.adoc:168` (Passkeys);
    - `spring-boot-flow-recipes.adoc:162` (device code);
    - `spring-security-authorization-server.adoc:367` (*Social login (Google, Microsoft, Apple)*; the issue gives the anchor `#_social_login_google_microsoft_apple`).
  - Pages from #344 to cross-link instead of repeating: `multi-factor-authentication.adoc` (factors, `amr` / `acr`, step-up), `login-and-consent-pages.adoc` (login fragments),
    `registered-clients.adoc` (client auth settings), `resource-server.adoc` (the `resource-server-bound-tokens` region for certificate-bound tokens),
    `signing-keys-jws-and-jwt.adoc` and `backend-for-frontend.adoc` (implicit migration target).
- **Example repo** (`albertoirurueta/irurueta-auth-server`, `main`, 77b11fd0).
  - A local checkout is at `/Users/albertoirurueta/repositories/common/irurueta-auth-server`. Ignore its `.claude/worktrees/`, which holds copies of the sources.
  - Its `.archive/implementation_plan_5.md` to `_8.md` state the scope of each code issue. Read the matching one before writing each page.
  - Tag inventory, built in this session, by page. Paths are shortened: `web/` means `auth-server/api/web/src/main/java/com/irurueta/authserver/authorization/api/web/`,
    `app/` means `auth-server/application/src/main/java/com/irurueta/authserver/authorization/application/`, `dom/` means `auth-server/domain/src/main/java/com/irurueta/authserver/authorization/domain/`,
    `per/` means `auth-server/infrastructure/persistence/src/main/java/com/irurueta/authserver/authorization/infrastructure/persistence/`,
    `mig/` means `auth-server/infrastructure/persistence/src/main/resources/db/migration/`, `tpl/` means `auth-server/api/web/src/main/resources/templates/`,
    `yml` means `auth-server/boot/src/main/resources/application.yml`, `api` means `apis/auth-server/rest-server/auth-server-api-v1.yaml`,
    `pages` means `apis/auth-server/web-pages/auth-server-pages-v1.yaml`, and `svc/` means `service-client/infrastructure/resourceserver/src/main/java/com/irurueta/authserver/serviceclient/infrastructure/resourceserver/`.
    Confirm each full path in the checkout before writing the include. The `apis/` folder has no Collector scan in `docs/antora.yml`: check whether it is published,
    and if it is not, describe the API from the YAML in prose and record the gap in Task 11.
    - **Passkeys:**
      - `web/passkeys/PasskeyConfiguration.java` `passkeys-chain-customizer`
      - `web/passkeys/PasskeyChainCustomizer.java` `passkeys-chain`
      - `web/passkeys/PasskeyFactor.java` `passkeys-factor`
      - `web/passkeys/PasskeysPageController.java` `passkeys-page-controller`
      - `app/passkeys/PasskeyProperties.java` `passkeys-properties`
      - `per/passkeys/WebAuthnJdbcConfiguration.java` `passkeys-jdbc-repositories`
      - `per/passkeys/WebauthnJacksonModuleContributor.java` `passkeys-json-mapper`
      - `mig/V500__webauthn.sql` `passkeys-schema`
      - `yml` `passkeys-config`
      - `tpl/passkeys.html` `passkeys-login`, `tpl/passkeys-second-factor.html` `passkeys-second-factor`, `tpl/account-passkeys.html` `passkeys-register-form`
      - `auth-server/api/web/src/main/resources/static/js/passkeys.js` `passkeys-register`, `passkeys-authenticate`
      - API tags: `api` `passkeys-api-contract`, `passkeys-parameters`, `passkeys-schemas`; `pages` `passkeys-page-api`
    - **E-mail OTP and magic links:**
      - `web/ott/OttConfiguration.java` `ott-chain-customizer`, `ott-resolver-bean`
      - `web/ott/OttChainCustomizer.java` `ott-chain`
      - `web/ott/OttGenerateRequestResolver.java` `ott-generate-resolver`
      - `web/ott/OttDeliveryListener.java` `ott-delivery-listener`
      - `web/ott/OttRateLimiter.java` `ott-rate-limit`
      - `web/ott/OttFactors.java` `ott-factors`
      - `web/ott/OttLoginMethodFragment.java` `ott-login-fragment`; `tpl/login-ott.html` `ott-login-fragment`
      - `web/ott/OttSecondFactorFragment.java` `ott-second-factor-fragment`; `tpl/ott-second-factor.html` `ott-second-factor-fragment`
      - `web/ott/OttSecondFactorChannels.java` `ott-second-factor-channels`
      - `per/ott/OneTimeTokenServiceConfiguration.java` `ott-token-service`
      - `auth-server/infrastructure/mail/src/main/java/…/infrastructure/mail/ThymeleafOttMailer.java` `ott-mailer`
      - `mig/V600__one_time_tokens.sql` `ott-schema`, `mig/V610__ott_codes.sql` `ott-codes-schema`
      - `yml` `ott-config`, `ott-rate-limit-config`
      - `pages` `ott-pages-api`
    - **SMS OTP:**
      - `dom/sms/SmsSender.java` `sms-sender`
      - `auth-server/infrastructure/sms/src/main/java/…/infrastructure/sms/SmsAdapterConfiguration.java` `sms-adapters`
      - `web/ott/PhonePageController.java` `phone-page-controller`
      - `mig/V620__user_phones.sql` `sms-phones-schema`, `mig/V630__sms_cost_ledger.sql` `sms-cost-ledger-schema`
      - `yml` `sms-config`
      - API tags: `api` `phone-api-contract`, `phone-schemas`; `pages` `phone-page-api`, `sms-dev-inbox-page-api`
      - Shared with the e-mail page: `ott-second-factor-channels`, `ott-delivery-listener`, `ott-rate-limit`
    - **Social login and identity brokering:**
      - `web/social/SocialConfiguration.java` `social-registrations`, `social-chain-customizer`
      - `web/social/SocialChainCustomizer.java` `social-chain`
      - `web/social/SocialProperties.java` `social-properties`
      - `web/social/ClientRegistrationMapper.java` `social-client-registrations`
      - `web/social/FederatedOidcUserService.java` `social-oidc-user-service`, `web/social/FederatedOAuth2UserService.java` `social-oauth2-user-service`
      - `web/social/FederatedUserMapper.java` `social-user-mapper`, `web/social/FederatedAccountResolver.java` `social-account-resolver`
      - `web/social/FederatedAuthenticationSuccessHandler.java` `social-success-handler`
      - `web/social/PendingIdentityLinks.java` `social-pending-link`
      - `web/social/FederatedFactor.java` `social-factor`, `web/social/FederatedFactorSelector.java` `social-factor-selector`
      - `web/social/IdpClaimsContributor.java` `social-claims`
      - `web/social/EntraIssuerValidator.java` `social-entra-validator`
      - `web/social/AppleClientSecretGenerator.java` `social-apple-secret`, `web/social/AppleTokenRequestCustomizer.java` `social-apple-token-request`
      - `web/social/SocialLoginMethodFragment.java` `social-login-method-fragment`; `tpl/login-social.html` `social-login-fragment`
      - `web/social/IdentityController.java` `social-identity-controller`, `web/social/IdentitiesPageController.java` `social-identities-page-controller`; `tpl/account-identities.html` `social-identities-link-form`
      - `app/social/LockSignInMethodsUseCase.java` `social-lock-sign-in-methods`; `dom/social/SignInMethodsLock.java` `social-sign-in-methods-lock`; `dom/social/VerifiedEmailLookup.java` `social-verified-email-port`
      - `per/social/JdbcFederatedIdentityRepository.java` `social-lock-subject`, `per/social/FederatedJacksonModuleContributor.java` `social-json-mapper`
      - `mig/V700__federated_identities.sql` `federated-schema` (V701 has no tag)
      - `yml` `social-config`
      - `auth-server/infrastructure/github` (GitHub verified-email adapter): check it for tags
    - **Other passwordless methods:**
      - X.509:
        - `web/x509/X509Configuration.java` `x509-chain-customizer`, `web/x509/X509ChainCustomizer.java` `x509-chain`
        - `web/x509/X509Properties.java` `x509-properties`, `web/x509/X509UserDetailsService.java` `x509-user-details`
        - `web/x509/X509AuthenticationSuccessHandler.java` `x509-success-handler`, `web/x509/X509Factor.java` `x509-factor`
        - `web/x509/X509TlsConnectorCustomizer.java` `x509-tls-connector`
        - `web/x509/ForwardedCertificateFilter.java` `x509-forwarded-filter`, `web/x509/X509ForwardedHeadersGuard.java` `x509-forwarded-headers-guard`
        - `web/x509/PemCertificateReader.java` `x509-pem-reader`, `web/x509/CertificateController.java` `x509-certificate-controller`
        - `web/x509/X509LoginMethodFragment.java` `x509-login-method-fragment`; `tpl/login-x509.html` `x509-login-fragment`
        - `app/x509/UnbindCertificateUseCase.java` `x509-unbind-use-case`
        - `mig/V710__x509_certificates.sql` `x509-schema`, `yml` `x509-config`
        - API tags: `api` `certificates-api-contract`, `certificates-schemas`
      - Device grant (under the `implicit` package in the code):
        - `web/implicit/DeviceConfiguration.java` `device-protocol-customizer`, `web/implicit/DeviceProtocolChainCustomizer.java` `device-protocol-chain`
        - `web/implicit/DeviceClientAuthenticationConverter.java` `device-client-authentication`
        - `web/implicit/DeviceVerificationController.java` `device-verification-controller`, `web/implicit/DeviceVerificationRequestGuard.java` `device-guard`
        - `web/implicit/DeviceVerificationRateLimiter.java` `device-rate-limit`
        - `tpl/device-verification.html` `device-verification-page`, `yml` `device-config`
        - `pages` `device-verification-page-api`
      - Check `service-client` for a device-flow CLI tag; none was found in the inventory.
    - **Implicit:**
      - `web/implicit/LegacyImplicitConfiguration.java` `implicit-chain-config`, `web/implicit/LegacyImplicitProtocolChainCustomizer.java` `implicit-chain`
      - `web/implicit/LegacyImplicitAuthorizationRequestConverter.java` `implicit-converter`, `web/implicit/LegacyImplicitAuthenticationProvider.java` `implicit-provider`
      - `web/implicit/LegacyImplicitResponseHandler.java` `implicit-response-handler`, `web/implicit/LegacyImplicitProperties.java` `implicit-properties`
      - `auth-server/boot/src/main/resources/application-legacy-implicit.yml` `legacy-implicit-config`
      - `auth-server/api/web/src/main/resources/legacy-implicit/index.html` and `legacy-implicit.js` `implicit-demo-page`
    - **Client credentials and service-to-service:**
      - Server side:
        - `web/clientauth/ClientAuthConfiguration.java` `clientauth-decoder-bean`, `web/clientauth/ClientAuthProtocolChainCustomizer.java` `clientauth-chain`
        - `web/clientauth/RegisteredJwksClientAssertionDecoderFactory.java` `clientauth-assertion-decoder`, `web/clientauth/ReplayRejectingJwtValidator.java` `clientauth-replay-validator`
        - `web/clientauth/ClientCertificateVerifier.java` `clientauth-certificate-verifier`, `web/clientauth/MtlsProperties.java` `clientauth-mtls-properties`
        - `web/exchange/TokenExchangeAudienceContributor.java` `exchange-claims`
        - `mig/V800__client_assertion_jtis.sql` `client-assertion-schema`, `yml` `client-assertion-config`, `mtls-config`
      - Client side:
        - `svc/OAuth2ClientConfiguration.java` `client-credentials-manager`, `token-exchange-client`
        - `svc/PrivateKeyJwkResolver.java` `private-key-jwt-client`, `svc/DPoPClientHttpRequestInterceptor.java` `dpop-client`
        - `svc/DocumentCalls.java` `service-client-gateway`, `svc/DocumentsApis.java` `service-client-documents-client`
      - Related tags already used by #344 pages: `clients-auth-settings` and `clients-seed` (registered-clients), `resource-server-bound-tokens` (resource-server).
        Cross-link to them instead of including them twice, unless the page needs the listing itself.

## Implementation steps

### Group 1 (Parallelizable: yes — each task creates one new page; Task 8 edits only `data-model.adoc`; no two tasks edit the same file)

Rules that apply to every page task in this group:

- **Before writing:**
  - Read the matching `.archive/implementation_plan_<n>.md` in the example and every source file whose tag the page includes, so prose matches behaviour.
  - Check each official URL.
- **Header:** title `= Authorization Server from Scratch: <Topic>`, then `:description:`, `:keywords:`, a blank line and `include::partial$springboot-disclaimer.adoc[]`.
- **Shape:** the eight sections from #159, in order.
- **Spring building blocks:** a table with columns Type, Implement / Configure, Role in the example, and a link to the Javadoc or reference page.
- **Code listings:** every listing is `[source,<lang>]`, then `----`, the `include::irurueta-auth-server::example$<full path>[tag=<tag>]` line, and `----`.
  The next line after the listing is an official link (`Reference: link:<url>[<title>]`, matching the style of the #344 pages).
- **Tests:** describe the test classes in prose. Never paste test code.
- **CLAUDE.md rules:**
  - image macros on one line, with quoted alt text when it has a comma;
  - constrained passthrough `+…+` for inline code containing `->`, `{`, `*`, `...`, `'`, `__`, `#[`, `~` or `^`, and `pass:c[…]` for code containing `+`.
    This matters for URLs such as `+/oauth2/authorize?response_type=token&…+`, for JSON, and for SpEL;
  - Mermaid `<` followed by a letter written as `&lt;`.
- **No new nav line** in this group; nav lines are added in Task 8.

- [x] Task 1. Write `passkeys.adoc` (documents irurueta-auth-server#5)
  - [x] Task 1.1. *What you build*: passkeys as a passwordless primary method and as a second factor. Link the theory with
        `xref:backend/oauth/authentication-methods-2fa-and-passwordless.adoc#_passkeys_webauthn_fido2[]`, `…#_hardware_otp_tokens_and_passkeys_used_as_a_second_factor[]`
        (verify the generated ids) and `xref:backend/oauth/spring-boot-authentication-methods.adoc#_passkeys[]`. Add external links to W3C WebAuthn Level 3 and passkeys.dev.
        Say what Spring Security's `webAuthn()` DSL gives and what the example adds (factor, page, account API, JSON mapper).
  - [x] Task 1.2. Two Mermaid `sequenceDiagram`s, *registration* and *authentication* (browser ↔ authenticator ↔ server), with participants browser JS, `navigator.credentials`, the
        authenticator, `/webauthn/register/options`, `/webauthn/register`, `/webauthn/authenticate/options`, `/login/webauthn` and the JDBC repositories.
        Check both against `passkeys.js` (`passkeys-register`, `passkeys-authenticate`) and `PasskeyChainCustomizer`.
  - [x] Task 1.3. Spring building blocks table. Rows: `HttpSecurity.webAuthn()`, `PublicKeyCredentialUserEntityRepository` / `JdbcPublicKeyCredentialUserEntityRepository`,
        `UserCredentialRepository` / `JdbcUserCredentialRepository`, `WebAuthnRelyingPartyOperations`, `Customizer<HttpSecurity>`, and the example's `PasskeyFactor`
        with its link to `FactorGrantedAuthority`. Confirm every name against the Spring Security 7.1 Passkeys reference.
  - [x] Task 1.4. *Data*: include `passkeys-schema` (V500), list its tables with the purpose of each, and link to the Spring JDBC schema it mirrors.
        *Code*: include `passkeys-config`, `passkeys-properties`, `passkeys-chain-customizer`, `passkeys-chain`, `passkeys-factor`, `passkeys-jdbc-repositories`, `passkeys-json-mapper`,
        `passkeys-page-controller`, `passkeys-login`, `passkeys-second-factor`, `passkeys-register-form`, `passkeys-register` and `passkeys-authenticate`, each followed by an official link.
  - [x] Task 1.5. *API*: the Spring endpoints, with request / response examples taken from the code or the Spring reference, plus the account passkey list / rename / delete API from
        `passkeys-api-contract`, `passkeys-parameters`, `passkeys-schemas` and `passkeys-page-api` (see the `apis/` publishing check in Current code state).
        *Tests*: prose on `PasskeyRegistrationIT`, `PasskeyAccountIT`, `PasskeyPagesIT`, `PasskeyConfigurationIT`, `JdbcPasskeyRepositoryIT` and `PasskeyEndToEndIT`
        (Selenium virtual authenticator).
        *Security notes*: phishing resistance and the RP ID / origin binding, user verification, synced vs. device-bound passkeys, account recovery, credential deletion,
        attestation. Use `xref:` to the OAuth Reference instead of repeating it.
- [x] Task 2. Write `email-otp-and-magic-links.adoc` (documents irurueta-auth-server#6, e-mail)
  - [x] Task 2.1. *What you build*: a one-time code and a magic link, both as primary login and as a second factor. Link
        `xref:backend/oauth/authentication-methods-2fa-and-passwordless.adoc#_e_mail_one_time_code_otp[]`, `…#_e_mail_magic_link_single_use_token[]` and `…#_e_mail_or_sms_otp_as_a_second_factor[]`
        (verify ids), and `xref:backend/resilience/bucket4j-spring-boot-manual-integration.adoc[]` for rate limiting.
        Say what `oneTimeTokenLogin()` / `JdbcOneTimeTokenService` gives and what the example adds: numeric codes in `V610`, the confirm page, delivery through a listener, rate limiting.
  - [x] Task 2.2. Mermaid diagrams for the *code* variant and the *link* variant. The link variant must show the **confirm-page POST**: the GET from the e-mail renders a page
        and only a POST consumes the token, so link scanners cannot burn it. Check both against `OttChainCustomizer`, `OttGenerateRequestResolver` and `OttDeliveryListener`.
  - [x] Task 2.3. Spring building blocks: `HttpSecurity.oneTimeTokenLogin()`, `OneTimeTokenService` / `JdbcOneTimeTokenService`, `OneTimeTokenGenerationSuccessHandler`,
        `GenerateOneTimeTokenRequestResolver`, `OneTimeTokenAuthenticationToken`, `AuthenticationProvider` and the example's factor types.
        Confirm the names against the Spring Security 7.1 One-Time Token Login reference.
  - [x] Task 2.4. *Data*: `ott-schema` (V600) and `ott-codes-schema` (V610).
        *Code*: `ott-config`, `ott-rate-limit-config`, `ott-chain-customizer`, `ott-resolver-bean`, `ott-chain`, `ott-generate-resolver`, `ott-token-service`, `ott-delivery-listener`,
        `ott-mailer`, `ott-rate-limit`, `ott-factors`, `ott-login-fragment` (Java and HTML), `ott-second-factor-fragment` (Java and HTML) and `ott-second-factor-channels`.
  - [x] Task 2.5. *API*: `/ott/generate`, `/login/ott` and the confirm page, from `ott-pages-api`.
        *Tests*: prose on `OttEmailCodeIT`, `OttMagicLinkIT`, `OttPagesIT`, `OttRateLimitIT`, `OttEnumerationIT`, `JdbcOneTimeCodeRepositoryIT` and `OttEndToEndIT` (Mailpit).
        *Security notes*: enumeration (the same response for unknown e-mails), rate limiting per address and per IP, single use and expiry, link prefetching by mail scanners,
        and cross-device use. Mention Mailpit in dev, with an `xref:` to `project-setup.adoc`.
- [x] Task 3. Write `sms-otp.adoc` (documents irurueta-auth-server#6, SMS)
  - [x] Task 3.1. *What you build*: phone verification, then SMS codes for login and as a second factor. Link
        `xref:backend/oauth/authentication-methods-2fa-and-passwordless.adoc#_sms_one_time_code_otp[]` and say that NIST SP 800-63B classes SMS as a "restricted authenticator" (with a link).
        Cross-link the e-mail page for the shared one-time-token machinery instead of repeating it.
  - [x] Task 3.2. Mermaid diagrams: *phone verification* (add a number, receive a code, confirm, verified flag) and *login with SMS code*. Check them against `PhonePageController`,
        `OttSecondFactorChannels` and `SmsSender`.
  - [x] Task 3.3. A table of risks and mitigations. Fill each row from what the code actually does: SIM swap, SMS pumping / toll fraud (the cost ledger `V630`, per-number and
        per-country limits from `sms-config`), interception and SS7, number recycling, enumeration.
  - [x] Task 3.4. Spring building blocks: the example's `SmsSender` port as a hexagonal port (implement) and its adapters (`LoggingSmsSender`, Twilio, AWS SNS) chosen by profile in `sms-adapters`.
        *Data*: `sms-phones-schema` (V620) and `sms-cost-ledger-schema` (V630).
        *Code*: `sms-config`, `sms-sender`, `sms-adapters` and `phone-page-controller`, plus the shared `ott-second-factor-channels` region where needed.
  - [x] Task 3.5. *API* from `phone-api-contract`, `phone-schemas`, `phone-page-api` and `sms-dev-inbox-page-api` (the dev-only inbox page).
        *Tests*: prose on `OttSmsIT`, `OttSmsLimitsIT`, `PhoneApiIT`, `SmsSenderProfilesIT`, `JdbcUserPhoneRepositoryIT`, `JdbcPhoneVerificationRepositoryIT` and `JdbcSmsCostLedgerRepositoryIT`.
        State that CI never calls a real gateway.
- [x] Task 4. Write `social-login-and-identity-brokering.adoc` (documents irurueta-auth-server#7, federation)
  - [x] Task 4.1. *What you build*: the authorization server *brokers* Google, Microsoft Entra ID, Apple and GitHub identities, links them to local accounts and issues its own tokens.
        Link `xref:backend/oauth/social-login-and-federation.adoc[]`, `xref:backend/oauth/authentication-methods-2fa-and-passwordless.adoc#_federated_social_login_as_passwordless_by_delegation[]`
        and `xref:backend/springboot/spring-security-authorization-server.adoc#_social_login_google_microsoft_apple[]` (verify the ids).
        Explain in its own short section how this differs from the client-app social login on that page: there the app is the OAuth client of the IdP; here the
        authorization server is, and downstream clients see only its tokens and `amr`.
  - [x] Task 4.2. A Mermaid `sequenceDiagram` of brokered login with account linking: the IdP callback, `FederatedOidcUserService`, `FederatedAccountResolver` (existing link /
        verified e-mail match / pending link that needs the local password / new account) and `FederatedAuthenticationSuccessHandler`, then back to `/oauth2/authorize`.
        Check it against `social-account-resolver`, `social-pending-link` and `social-success-handler`.
  - [x] Task 4.3. Spring building blocks: `oauth2Login()`, `ClientRegistrationRepository`, `OidcUserService` / `OAuth2UserService`, `AuthenticationSuccessHandler`, `JwtDecoderFactory` or
        the code's equivalent for the Entra issuer check, and `OAuth2AccessTokenResponseClient` customization for Apple. Read the code for the exact types.
  - [x] Task 4.4. *Data*: `federated-schema` (V700), plus `V701__generated_passwords.sql` described in prose with a column table, because it has no tag.
        *Code*: `social-config`, `social-properties`, `social-registrations`, `social-client-registrations`, `social-chain-customizer`, `social-chain`, `social-oidc-user-service`,
        `social-oauth2-user-service`, `social-user-mapper`, `social-account-resolver`, `social-pending-link`, `social-success-handler`, `social-factor`, `social-factor-selector`,
        `social-claims`, `social-entra-validator`, `social-apple-secret`, `social-apple-token-request`, `social-login-method-fragment`, `social-login-fragment`,
        `social-identity-controller`, `social-identities-page-controller`, `social-identities-link-form`, `social-lock-sign-in-methods`, `social-sign-in-methods-lock`,
        `social-verified-email-port`, `social-lock-subject` and `social-json-mapper`.
        Group them under sub-headings (registrations, user mapping and linking, provider quirks, account page) so the page stays readable.
  - [x] Task 4.5. *API*: the linked-accounts endpoints from the controllers (and the REST contract if a tag exists).
        *Tests*: prose on `SocialLoginIT`, `SocialLoginConfigurationIT`, `SocialEntraSingleTenantIT`, `SocialEntraMultiTenantIT`, `SocialTrustedProviderIT`,
        `JdbcFederatedIdentityRepositoryIT`, `JdbcGeneratedPasswordRepositoryIT` and `JdbcSignInMethodsLockIT`.
        *Security notes*: account takeover through unverified e-mail matching, Entra multi-tenant issuer validation, Apple's private relay and client-secret JWT,
        unlinking the last sign-in method (the lock), and `amr` / `idp` claims to clients.
- [x] Task 5. Write `other-passwordless-methods.adoc` (documents irurueta-auth-server#7: X.509, device grant, push design notes)
  - [x] Task 5.1. *What you build*: three sections, each with its own short 8-step treatment, or a shared Spring building blocks table if that reads better.
        - X.509 client-certificate login, directly on TLS or behind a proxy with forwarded headers.
        - The device authorization grant (RFC 8628) for input-constrained devices.
        - Push approval with number matching, as a **design only** (not implemented: say so in a `NOTE`).
        Link `xref:backend/oauth/authentication-methods-2fa-and-passwordless.adoc#_certificate_smart_card_mtls_authentication[]`, `…#_push_approval_as_a_primary_factor[]`,
        `xref:backend/oauth/device-authorization-grant.adoc[]` and `xref:backend/oauth/spring-boot-flow-recipes.adoc[]` (device section, verify the anchor).
  - [x] Task 5.2. Mermaid diagrams:
        - X.509 login (TLS handshake or forwarded certificate → `X509UserDetailsService` → factor), checked against `x509-chain` and `x509-forwarded-filter`;
        - the device flow (`/oauth2/device_authorization` → user code → `/oauth2/device_verification` → polling `/oauth2/token`), checked against `device-protocol-chain`
          and `device-verification-controller`;
        - the push-approval design with number matching (sign-in shows a number, the phone app shows choices, the user picks the matching one, then approve or deny).
  - [x] Task 5.3. *Data*: `x509-schema` (V710).
        *Code, X.509*: `x509-config`, `x509-properties`, `x509-chain-customizer`, `x509-chain`, `x509-tls-connector`, `x509-forwarded-filter`, `x509-forwarded-headers-guard`,
        `x509-user-details`, `x509-success-handler`, `x509-factor`, `x509-pem-reader`, `x509-certificate-controller`, `x509-unbind-use-case`, `x509-login-method-fragment`
        and `x509-login-fragment`.
        *Code, device*: `device-config`, `device-protocol-customizer`, `device-protocol-chain`, `device-client-authentication`, `device-verification-controller`, `device-guard`,
        `device-rate-limit` and `device-verification-page`.
  - [x] Task 5.4. *API*: `certificates-api-contract` / `certificates-schemas` and `device-verification-page-api`, plus the device endpoints with `curl` examples.
        *Tests*: prose on `X509LoginIT`, `X509TlsLoginIT`, `X509ForwardedHeadersGuardIT`, `CertificateApiIT`, `JdbcCertificateBindingRepositoryIT`, `DeviceVerificationPageIT`,
        `DeviceVerificationRateLimitIT` and `DeviceFlowEndToEndIT`.
        *Security notes*: trusting forwarded certificate headers only from the proxy (the guard), revocation checking, user-code brute force and phishing in the device flow,
        and push fatigue, which number matching defeats.
- [x] Task 6. Write `implicit-flow-legacy-and-migration.adoc` (documents irurueta-auth-server#8, implicit)
  - [x] Task 6.1. Open with a prominent `[WARNING]` block right after the disclaimer, saying three things. Implicit is removed by OAuth 2.1 and RFC 9700. Spring Authorization Server
        does not support `response_type=token`. The example ships it only as an opt-in `legacy-implicit` profile, off by default, for demonstration and migration.
        Link `xref:backend/oauth/legacy-implicit-and-password-grants.adoc[]` and `xref:backend/oauth/browser-based-apps.adoc[]`.
  - [x] Task 6.2. A short demo part, about a third of the page:
        - a Mermaid diagram of implicit next to authorization code + PKCE (token in the URL fragment vs. code exchanged at the token endpoint);
        - Spring building blocks: a custom `AuthenticationConverter`, a custom `AuthenticationProvider`, an `AuthenticationSuccessHandler` writing the fragment, and the profile;
        - *Code*: `legacy-implicit-config`, `implicit-properties`, `implicit-chain-config`, `implicit-chain`, `implicit-converter`, `implicit-provider`, `implicit-response-handler`
          and `implicit-demo-page` (HTML and JS);
        - *Tests*: prose on `ImplicitRejectedIT` (`unsupported_response_type` without the profile), `LegacyImplicitIT` and `LegacyImplicitEndToEndIT`.
  - [x] Task 6.3. The **migration guide**, most of the page:
        - to the BFF, with an `xref:` to `backend-for-frontend.adoc`;
        - to a public client with authorization code + PKCE, with an `xref:` to `registered-clients.adoc` for the client settings;
        - auditing lingering implicit clients: how to find registered clients with the implicit grant or `response_type=token` in logs and `oauth2_registered_client`, using only
          queries the schema supports;
        - a deprecation checklist as an AsciiDoc checklist: inventory, communicate, dual-run, cut over, remove the grant, remove the profile.
        Do not present implicit as a recommended option anywhere.
- [x] Task 7. Write `client-credentials-and-service-to-service.adoc` (documents irurueta-auth-server#8: client credentials, client auth, token exchange)
  - [x] Task 7.1. *What you build*: `service-client` gets tokens with `client_credentials` using `private_key_jwt` (RFC 7523) or mTLS client authentication with certificate-bound
        tokens (RFC 8705), calls the resource server, and uses token exchange (RFC 8693) for a delegated call chain. DPoP (RFC 9449) is covered as well, because the client has a `dpop-client` region.
        Link `xref:backend/oauth/client-credentials-and-client-authentication.adoc[]`, `xref:backend/oauth/sender-constrained-tokens-dpop-and-mtls.adoc[]` and
        `xref:backend/oauth/token-exchange-and-assertion-grants.adoc[]`.
  - [x] Task 7.2. Mermaid diagrams:
        - `private_key_jwt`: the client signs an assertion, the authorization server resolves the client's JWKS (`clientauth-assertion-decoder`), checks the `jti` replay, then issues the token;
        - the mTLS-bound token: TLS client certificate, `cnf.x5t#S256` in the token, and the resource server checking the thumbprint (`xref:` to `resource-server.adoc`). Write the `#` claim safely in inline code;
        - the token-exchange chain: subject token → exchange → audience-restricted token (`exchange-claims`).
  - [x] Task 7.3. A table comparing client-auth methods: `client_secret_basic`, `client_secret_post`, `client_secret_jwt`, `private_key_jwt`, `tls_client_auth`,
        `self_signed_tls_client_auth` and `none` + PKCE. Columns: secret at rest on the client, replay protection, token binding, what the example uses it for, Spring support.
        Take the "used for" column from the seeded clients (`clients-seed`); do not invent clients.
  - [x] Task 7.4. Spring building blocks: `OAuth2AuthorizedClientManager` / `AuthorizedClientServiceOAuth2AuthorizedClientManager`, `NimbusJwtClientAuthenticationParametersConverter`
        (or the code's equivalent), `JwtClientAssertionDecoderFactory` / `JwtDecoderFactory<RegisteredClient>`, `OAuth2TokenValidator<Jwt>`,
        `X509ClientCertificateAuthenticationProvider` or the code's equivalent, the token-exchange grant types, and `OAuth2TokenCustomizer`. Read the code for the exact types.
        *Data*: `client-assertion-schema` (V800).
        *Code, server*: `client-assertion-config`, `mtls-config`, `clientauth-mtls-properties`, `clientauth-decoder-bean`, `clientauth-chain`, `clientauth-assertion-decoder`,
        `clientauth-replay-validator`, `clientauth-certificate-verifier` and `exchange-claims`.
        *Code, client*: `client-credentials-manager`, `private-key-jwt-client`, `token-exchange-client`, `dpop-client`, `service-client-gateway` and `service-client-documents-client`.
  - [x] Task 7.5. *API*: `curl` examples of the token request with a client assertion and with mTLS, and of the token-exchange request (form parameters per RFC 8693), all inside listings,
        not inline code.
        *Tests*: prose on `ClientAuthenticationIT`, `TokenExchangeIT`, `JdbcClientAssertionReplayRegistryIT`, `ServiceClientApplicationIT`, `ResourceServerAdapterIT`,
        `ClientCredentialsEndToEndIT` and `TokenExchangeEndToEndIT`.
        *Security notes*: key rotation of client JWKS, assertion lifetime and `jti` replay, audience restriction on exchanged tokens, least-privilege scopes, and never shipping
        client secrets in code.
- [x] Task 8. Extend `data-model.adoc` with the tables these code issues added
  - [x] Task 8.1. Add a section `== Tables added by the passwordless, federation and service-to-service pages`, with one `===` per migration: V500, V600, V610, V620, V630, V700, V701, V710 and V800.
        Each has a column table or an `include::` of its SQL tag (`passkeys-schema`, `ott-schema`, `ott-codes-schema`, `sms-phones-schema`, `sms-cost-ledger-schema`, `federated-schema`,
        `x509-schema`, `client-assertion-schema`; V701 as a column table read from the SQL) and an `xref:` to the page that explains the table.
        Where a table is Spring-defined (the WebAuthn and one-time-token tables), add an official link.
  - [x] Task 8.2. Extend the erDiagram, or add a second linked erDiagram if the first becomes unreadable, with these tables and their foreign keys to `users` and
        `oauth2_registered_client`. Read the relationships from the SQL.
  - [x] Task 8.3. In `== Tables added by later pages`, remove the V500 to V800 rows that now have a section. If no rows remain (only #336 work would be left), remove the section entirely
        and adjust any sentence that refers to it. Update the `== Flyway layout` rows `V5xx` to `V8xx` with `xref:`s to the new pages.
  - [x] Task 8.4. Add the seven nav lines in `modules/ROOT/nav.adoc`, right after the `totp-and-recovery-codes` line at about line 1519, at the same `*****` level, in the #159 order:
        `passkeys.adoc[Passkeys (WebAuthn)]`, `email-otp-and-magic-links.adoc[E-mail OTP & Magic Links]`, `sms-otp.adoc[SMS OTP]`,
        `social-login-and-identity-brokering.adoc[Social Login & Identity Brokering]`, `other-passwordless-methods.adoc[Other Passwordless Methods]`,
        `implicit-flow-legacy-and-migration.adoc[Implicit Flow: Legacy Demo & Migration]`, `client-credentials-and-service-to-service.adoc[Client Credentials & Service-to-Service]`.
        Each line is `***** xref:backend/springboot/authorization-server-from-scratch/<file>[<title>]`. Add no other nav line. This sub-task lives in Task 8 because Task 8 is the
        only task in the group that touches shared files.

### Group 2 (Parallelizable: no — verification depends on every page, the data-model update and the nav being in place)

- [x] Task 9. Build and verify
  - [x] Task 9.1. Run `npx antora --fetch antora-playbook.yml`. The build is long, so run it in the background or delegate it to `iru-gate-runner`.
        It must finish with no `xref`, include or tag warnings or errors. Fix and rebuild until clean.
  - [x] Task 9.2. Run the three `CLAUDE.md` image greps, with every `--include` pattern quoted:
        - block macros not closed on one line;
        - inline macros not closed on one line;
        - `<p>image::` in `build/site`.
        Also run the unquoted-comma alt-text grep on the seven new `.adoc` files and `data-model.adoc`, and the inline-code substitution grep on
        `build/site/backend/springboot/authorization-server-from-scratch`. All must print nothing.
        Also scan the rendered text of the seven pages for stray backticks, `+` and `[[`, and for quote defects, which the greps miss.
  - [x] Task 9.3. Run `npm i --no-save mermaid@11 jsdom`, then `npm run validate:mermaid`. Every diagram must report as parsed, including those on the seven new pages and in `data-model.adoc`.
  - [x] Task 9.4. Check that every new `springboot-authz-*.svg`, if any was created, is referenced by at least one page, and that every `image::` target in the seven pages exists in `modules/ROOT/images/`.
  - [x] Task 9.5. Serve `build/site` with a temporary preview config, because the tracked `launch.json` serves the wrong directory. Open the seven pages and `data-model.adoc` in the
        Browser pane and check three things: the includes show code (not empty or "unresolved directive"), the Mermaid diagrams draw, and the implicit page's `WARNING` renders at the top.
- [x] Task 10. Check every include against the example
  - [x] Task 10.1. Write a script in the scratchpad, not in the repo. For each `include::irurueta-auth-server::example$<path>[tag=<tag>]` in the seven pages and `data-model.adoc`:
        - map `example$<module path>/src/…` to `irurueta-auth-server/<module path>/src/…` (per the Collector `into:` mapping);
        - assert that the file exists and contains both `tag::<tag>[]` and `end::<tag>[]`.
        It must report zero misses. This check is independent of Antora's own warnings, which can be lenient about tags.
  - [x] Task 10.2. Check that every listing is followed by an official link, by reading each `----` block that has an `include::` and the line after it.
- [x] Task 11. Record gaps in the example
  - [x] Task 11.1. Collect every place where a page needed code, a config region, a migration or a test that has no tag in irurueta-auth-server. Known so far:
        `V701__generated_passwords.sql`, every test class of this wave, the push-approval design (no code by design), possibly the `apis/` YAML regions if they are not
        Collector-published, and the device-flow CLI if one exists. List them in the PR description with the file and a proposed tag name.
        Offer to open a follow-up issue in irurueta-auth-server rather than pasting code.
  - [x] Task 11.2. Confirm that no page contains code that the example does not, and that `index.adoc`, back-links, bibliography, `api-reference`, `hardening-and-production` and `testing`
        were not touched (they are #336).
