# Implementation Plan: Authorization Server from Scratch docs (4/4): section index, API reference, hardening and testing pages, back-links, bibliography, release-branch switch and full verification (issue #336)

## Task summary

Source: GitHub issue #336
Base branch: main

Issue [#336](https://github.com/albertoirurueta/docs/issues/336) is the last of four docs issues under umbrella #159 (#343, #344 and #345 are merged). It asks for:

- three new pages in `../modules/ROOT/pages/backend/springboot/authorization-server-from-scratch`: `api-reference.adoc`, `hardening-and-production.adoc` and `testing.adoc`;
- the section landing page `index.adoc` in the same directory;
- `nav.adoc` changes: `index.adoc` becomes the parent of the 19 lines added by #343 to #345, and the three new pages are appended in the order given in #159;
- landing page and back-links: `backend/springboot/index.adoc` (the *Security* list, `:description:` / `:keywords:`, *Bibliography*), `spring-security-authorization-server.adoc`, six OAuth Reference pages and `backend/oauth/index.adoc`;
- a bibliography covering every official source used across the section, and the example repository;
- switching the `irurueta-auth-server` playbook source from `main` to release branches, and updating `../CLAUDE.md` to match;
- the full-section verification that closes #159.

All code is included only through `include::irurueta-auth-server::example$<path>[tag=…]`. Code or tags that do not exist go on a follow-up list for the irurueta-auth-server repository, never pasted here.

### Choices made on the user's behalf

1. **The release-branch switch is gated (user's choice).** `irurueta-auth-server` has no `release_1.0.0` branch yet (`git ls-remote` shows `main`, `develop` and feature branches only). The pages, nav, back-links and bibliography are written now against `main`. The playbook and `../CLAUDE.md` switch is the last task and is deferred until 1.0.0 is released. The "includes resolve on the release branch" check is run against `main` now and must be repeated after the switch.
2. **The playbook currently tracks `main`, not `develop`.** The issue says `develop`. The switch in Task 8 is from `main` (see `antora-playbook.yml:96-101`).
3. **Pages follow the real code, not the issue's sketch**, as #343 to #345 did. The OpenAPI documents are in `apis/` (not `openapi/`) and reach the site as `example$apis/<app>/<kind>/<file>.yaml`. The example is a hexagonal multi-module build, so Java include paths are the Collector `into:` targets in `irurueta-auth-server/docs/antora.yml`.
4. **Test tags are scarce.** Only four test classes carry `tag::` regions, all in `auth-server/boot/src/test/…`: `ClientAdminIT` (`clients-auth-settings`), `TotpApiIT` (`mfa-step-up-api-it`), `TrustedDeviceIT` (`mfa-trusted-device-it`) and `MfaPasswordOnlyForcedIT` (`mfa-enrolment-in-login-it`). The `testing.adoc` page uses these where they fit a level. Levels with no tagged test (unit, `spring-security-test` slice, e2e, fixed clock) are described in prose, naming the class and what it proves, and go on the follow-up list (Task 10) rather than being pasted.
5. **API reference summarizes from the OpenAPI documents through tagged regions that exist.** `auth-server-pages-v1.yaml` has page-level tags (`login-page-api`, `ott-pages-api`, …). Task 1 first lists which tags exist in `auth-server-api-v1.yaml`, `bff-api-v1.yaml` and `resource-server-api-v1.yaml`. Where a document has no tag, the page summarizes in a table read from the document and links the file in the repository; missing tags go on the follow-up list.
6. **Figures are reused, not added.** The index reuses `springboot-authz-architecture.svg`. No new SVG is planned; Mermaid is used for any new diagram. Task 9 still checks that every `springboot-authz-*.svg` is referenced.
7. **Scope guard.** Only the files named above are changed. Existing section pages are touched only if the index or a back-link needs a fix found by verification.
8. **Tasks are untagged.** No installed `iru-*-code-one-task` key fits AsciiDoc / Mermaid authoring (project type `other`, Antora docs), so tasks are implemented directly.
9. **Official documentation is verified before each link is written.** Spring Boot 4.1 / Spring Security 7.1 names, RFC numbers, OWASP ASVS and NIST SP 800-63B-4 sections are checked against the current sources, not copied from memory.

Decision (user chose to proceed automatically): wait for the release, then switch. Task 8 is **deferred**: it must not be implemented in this run while `release_1.0.0` does not exist, and its boxes stay unchecked. Everything else is implemented now. Report Task 8 as deferred, not as a blocker.

Open clarifications: none

## Acceptance criteria coverage

| # | Criterion | Covered by tasks |
|---|---|---|
| 1 | "`npx antora --fetch antora-playbook.yml` has no errors or warnings for the section." | Task 9.1 |
| 2 | "All `../CLAUDE.md` grep checks print nothing for `build/site/backend/springboot/authorization-server-from-scratch`." | Task 9.2 |
| 3 | "`npm run validate:mermaid` parses every diagram." | Task 9.3 |
| 4 | "Every `springboot-authz-*.svg` is referenced." | Task 9.4 |
| 5 | "A rendered-HTML scan finds no stray backticks or unrendered macros." | Task 9.5 |
| 6 | "Every page follows the #159 page conventions, and every `example$` include resolves to an existing tag on the release branch." | Task 1, Task 2, Task 3, Task 4, Task 9.6, Task 8 (re-check after the switch) |
| 7 | "Both milestones are at 100%, and #159 is closed by this PR." | Task 11 |
| 8 | derived: `api-reference.adoc` has the protocol endpoints with `curl` examples for the non-interactive ones, the discovery document, the Spring Security authentication endpoints, the custom APIs and the error model | Task 1 |
| 9 | derived: `hardening-and-production.adoc` has the RFC 9700 / OWASP ASVS checklist and the "what running it for real would add" part | Task 2 |
| 10 | derived: `testing.adoc` has the test pyramid with one included example per level where a tag exists, the testing tricks and the test-only CI | Task 3 |
| 11 | derived: `index.adoc` has the feature matrix, flow matrix, prerequisites, reading order, clone-and-run instructions and a one-line summary of every page | Task 4 |
| 12 | derived: nav has `index.adoc` as parent of all section pages in #159 order, and no other nav line changes | Task 5 |
| 13 | derived: back-links, landing page entry and bibliography listed in the issue exist | Task 6, Task 7 |
| 14 | derived: the playbook source and the `../CLAUDE.md` description match the release-branch switch | Task 8 |

## Current code state

- **Docs repo** (`/Users/albertoirurueta/repositories/common/docs`, Antora playbook, component `ROOT`):
  - `../modules/ROOT/pages/backend/springboot/authorization-server-from-scratch` holds 19 pages (`architecture`, `project-setup`, `data-model`, `password-storage`, `signing-keys-jws-and-jwt`, `access-refresh-and-id-tokens`, `registered-clients`, `resource-server`, `login-and-consent-pages`, `backend-for-frontend`, `multi-factor-authentication`, `totp-and-recovery-codes`, `passkeys`, `email-otp-and-magic-links`, `sms-otp`, `social-login-and-identity-brokering`, `other-passwordless-methods`, `implicit-flow-legacy-and-migration`, `client-credentials-and-service-to-service`). No `index.adoc` yet.
  - `modules/ROOT/nav.adoc:1507-1526`: `**** xref:backend/springboot/spring-security-authorization-server.adoc[Authorization Server & Social Login]` followed by 19 `*****` lines. The index line is not there.
  - Page style (e.g. `client-credentials-and-service-to-service.adoc`): title `= Authorization Server from Scratch: <Topic>`, `:description:`, `:keywords:`, blank line, `include::partial$springboot-disclaimer.adoc[]`, then `== What you build` and the 8-step shape from #159.
  - `../modules/ROOT/pages/backend/springboot/index.adoc`: the *Security* entry for the authorization-server page is at line 151, the `:keywords:` attribute is on line 3, `== Bibliography` is at line 252, and the existing authorization-server references are at lines 462-465.
  - `../modules/ROOT/pages/backend/springboot/spring-security-authorization-server.adoc` (714 lines) ends with `== References` at line 702.
  - `../modules/ROOT/pages/backend/oauth/index.adoc` has a reading guide with `== What's covered` and subsections (*Spring Boot integration* at line 120).
  - `antora-playbook.yml:96-101`: the `irurueta-auth-server` source has `branches: [main]` and a comment saying #336 switches it. Other sources use patterns such as `release_1.{4..99}*`.
  - `CLAUDE.md:31-33` says `ai-catalog` and `irurueta-auth-server` track `main`, `irurueta-auth-server` "until its 1.0.0 release".
  - Existing pages to `xref:` from the new ones: `backend/springboot/logging.adoc`, `metrics-and-observability.adoc`, `scheduling-and-shedlock.adoc`, `unit-and-integration-testing.adoc`, `backend/oauth/testing-and-debugging.adoc`, `backend/oauth/security-best-practices.adoc`, `backend/oauth/par-jar-and-hardened-profiles.adoc`, `backend/oauth/sender-constrained-tokens-dpop-and-mtls.adoc`, the Docker / Kubernetes sections under `backend/docker/*`. Figures: `springboot-authz-architecture.svg`, `springboot-authz-key-rotation.svg`.
  - `../scripts/validate-mermaid.mjs` backs `npm run validate:mermaid`.
- **Example repo** (`albertoirurueta/irurueta-auth-server`, branch `main`, no release branch, Spring Boot 4.1 / Java 21 / Maven reactor):
  - Modules: `auth-server/` (domain, application, `infrastructure/*`, `api/web`, `boot`), `bff/`, `resource-server/`, `service-client/`, `e2e-tests/`, `test-support/`, `apis/`, `compose/`, `coverage/`, `docs/`.
  - `apis/` holds five OpenAPI documents (`auth-server/rest-server/auth-server-api-v1.yaml`, `auth-server/web-pages/auth-server-pages-v1.yaml`, `bff/rest-server/bff-api-v1.yaml`, `resource-server/rest-server/resource-server-api-v1.yaml`, `github/rest-server/github-api-v1.yaml`) plus a `../README.md` describing the contract-first layout.
  - `test-support/` has `OpenApiContract`, `OpenApiContractTest`, `PostgresIT`, `Mailpit*`, `TestPki`, `TestCertificates`. `e2e-tests/` has `PasskeyEndToEndIT`, `OttEndToEndIT`, `DeviceFlowEndToEndIT`, `LegacyImplicitEndToEndIT`, `ClientCredentialsEndToEndIT`, `TokenExchangeEndToEndIT`, `BffEndToEndIT`, `ResourceServerEndToEndIT`, `SignInSmokeIT`.
  - `docs/antora.yml` (component `irurueta-auth-server`, version `1.0.0`) has Collector scans for each module, plus `test-support`, `e2e-tests` and `apis`.
  - `../.github/workflows` runs tests only. `compose.yaml` and `compose/init-databases.sql` start PostgreSQL and Mailpit.

## Implementation steps

### Group 1 (Parallelizable: yes, each task writes its own new file)

- [x] Task 1. Write `api-reference.adoc` (API Reference)
  - Done: `api-reference.adoc` added; Antora build with `--fetch` has no warnings or errors, includes and anchors resolve, no inline-code substitutions. No license headers apply (docs). Group validation pending in Task 9.
  - [x] Task 1.1. Read the example before writing: list the endpoints and `tag::` regions in the five `apis/**.yaml` documents, the discovery document of the running example (from `project-setup.adoc` and `compose.yaml`), and the Spring Security endpoint paths used by the login, OTT and WebAuthn configurations. Record which OpenAPI regions can be included and which cannot.
    - Note (scratch list for Task 10): all five `apis/**.yaml` read. Tags exist and were used or are usable: `keys-api`, `bff-user-api`, `resource-server-documents-api` (included); `account-api`, `totp-api-contract`, `clients-api`, `passkeys/phone/identities/certificates-api-contract`, `bff-login-api`, `bff-documents-api`, `github-emails-contract`, the `*-schemas` regions and every `*-page-api` region of `auth-server-pages-v1.yaml` (left to the feature pages). Not available, by design: the protocol endpoints and the Spring Security authentication endpoints are not OpenAPI documents, so they are tables, not includes. Discovery document: NOT captured from a running instance (starting the example with `./mvnw spring-boot:run` was refused by the permission classifier in this run), so the listing on the page is assembled from configuration and specs and carries a NOTE saying so. Follow-up for irurueta-auth-server or a later run: capture the real `/.well-known/openid-configuration` output and replace the listing.
  - [x] Task 1.2. Create `../modules/ROOT/pages/backend/springboot/authorization-server-from-scratch/api-reference.adoc` with the standard header (title `= Authorization Server from Scratch: API Reference`, `:description:`, `:keywords:`, disclaimer partial).
  - [x] Task 1.3. Section *Protocol endpoints*: a table with path, method, purpose, spec (RFC 6749, 7009, 7662, 8414, 8628, 9126 if enabled, OIDC Core / Discovery / RP-Initiated Logout) and Spring component for each endpoint listed in #159's API surface. Add `curl` examples (in `[source,bash]` blocks) for the non-interactive ones: discovery, JWKS, `client_credentials` token, introspection, revocation, device authorization, userinfo. Show the example's discovery document (a trimmed JSON listing, taken from the running example's output).
  - [x] Task 1.4. Section *Spring Security authentication endpoints*: form login, logout, OTT (`/ott/generate`, `/login/ott`) and WebAuthn (`/webauthn/*`, `/login/webauthn`), each linked to the page that explains it.
  - [x] Task 1.5. Section *Custom APIs*: summary tables for `/api/account/**`, `/api/admin/**`, `/bff/**` and the resource-server documents API, with `include::irurueta-auth-server::example$apis/…[tag=…]` only for tags that exist, and a link to the file in the repository otherwise.
  - [x] Task 1.6. Section *Error model*: RFC 6749 section 5.2 error responses, RFC 9457 problem details, and `WWW-Authenticate` challenges (RFC 6750, RFC 9449), with an `xref:` to `backend/oauth/security-best-practices.adoc` and the resource-server page. Follow `../CLAUDE.md` for inline code containing `->`, `{`, `*` and URL templates (`+…+` passthrough).
  - [x] Task 1.7. Add the official-documentation link after every listing and end the page with the page's own link list.
- [x] Task 2. Write `hardening-and-production.adoc` (Hardening & Production)
  - Done: `hardening-and-production.adoc` added; same build result. Statuses were read from the example's code; absences (no HSTS config, no ShedLock, no metrics, no limiter on `/oauth2/token`) were grepped.
  - [x] Task 2.1. Create `hardening-and-production.adoc` with the standard header.
  - [x] Task 2.2. Section *Checklist against RFC 9700 and OWASP ASVS*: a table with control, why, where in the example (page `xref:`), and the standard (RFC 9700 / ASVS chapter or NIST SP 800-63B-4). Cover TLS / HSTS, cookies (`__Host-` prefix, `SameSite`, `Secure`, `HttpOnly`), CSP, CSRF, exact redirect URIs, PKCE, TTLs, refresh-token rotation, KMS / key encryption, secret management, rate limiting and lockout (`xref:` the `bucket4j` pages), enumeration resistance, audit logging (`xref:backend/springboot/logging.adoc`, the `security_events` table in `data-model.adoc`) and metrics (`xref:backend/springboot/metrics-and-observability.adoc`). Read the example's configuration first and mark each row implemented / partly / not implemented; never claim a control the code lacks.
  - [x] Task 2.3. Section *What running it for real would add*: HA with JDBC-backed state, ShedLock (`xref:backend/springboot/scheduling-and-shedlock.adoc`), `issuer` behind a proxy (`forward-headers-strategy`), clean-up jobs for expired authorizations / OTT codes / assertion `jti` rows, container images (`xref:` the Docker / Kubernetes sections), the OpenID conformance suite, and the PAR / DPoP profiles (`xref:backend/oauth/par-jar-and-hardened-profiles.adoc` and the DPoP page). Say plainly that the example is never deployed.
  - [x] Task 2.4. Add official-documentation links (RFC 9700, OWASP ASVS, Spring Security reference) and the page's link list.
- [x] Task 3. Write `testing.adoc` (Testing the Authorization Server)
  - Done: `testing.adoc` added; same build result. Includes the four tagged tests, `build.yml` `setup-ci-build-job` and `compose.yaml` `setup-compose-mailpit` (resolved after `--fetch`).
  - [x] Task 3.1. Map the example's tests to the pyramid levels by reading the modules: unit tests (`TotpGenerator`-style vectors, encoders, customizers: pick the real class names), `spring-security-test` slices (`user()`, `jwt()`, `oidcLogin()`, `oauth2Client()` usages), Testcontainers `*IT` tests (`PostgresIT`, `ClientAdminIT`, …) and e2e tests (`e2e-tests`, virtual authenticator, Mailpit, logging SMS sender). List which `tag::` regions exist for each level.
    - Note (scratch list for Task 10): tags that exist for tests are only `ClientAdminIT` `clients-auth-settings`, `TotpApiIT` `mfa-step-up-api-it`, `TrustedDeviceIT` `mfa-trusted-device-it`, `MfaPasswordOnlyForcedIT` `mfa-enrolment-in-login-it` (all level 3, Testcontainers), plus `.github/workflows/build.yml` `setup-ci-build-job` and `compose.yaml` `setup-compose-mailpit`. No tag for: unit level (`TotpAlgorithmTest`, `TotpCodeVerifierTest`, `AesGcmKeyCipherTest`, `StepUpGuardTest`, ...), `spring-security-test` slices (`jwt()` in `SecurityConfigIT` of the resource server and `ApiSecurityConfigIT`, `oidcLogin()` in the BFF ITs), end-to-end (all nine `*EndToEndIT`/`SignInSmokeIT`, virtual authenticator, Mailpit), fixed clocks (`Clock.fixed` in unit tests), `OpenApiContractTest`/`OpenApiDriftIT`, `LoggingSmsSender`/`SmsSenderProfilesIT`, `TestPki`/`TestCertificates`. Test code that does not exist: `oauth2Client()`, `opaqueToken()` and `@WithMockUser` post-processors are not used anywhere, and no test moves the application `Clock` in an integration test (they edit database timestamps and token claims instead).
  - [x] Task 3.2. Create `testing.adoc` with the standard header and a Mermaid diagram or table of the pyramid.
  - [x] Task 3.3. For each level include one tagged example where a tag exists (`ClientAdminIT` `clients-auth-settings`, `TotpApiIT` `mfa-step-up-api-it`, `TrustedDeviceIT` `mfa-trusted-device-it`, `MfaPasswordOnlyForcedIT` `mfa-enrolment-in-login-it`), and describe the others in prose with class name and what each proves.
  - [x] Task 3.4. Section *Testing tricks*: fixed clocks and key-rotation time travel (read the real mechanism in the code first), `OpenApiContractTest` as the contract check, Mailpit and the logging SMS sender, generated test certificates (`TestPki`, `TestCertificates`). Section *Test-only CI*: describe the example's `../.github/workflows` file from the repository, with a link.
  - [x] Task 3.5. `xref:` `backend/springboot/unit-and-integration-testing.adoc` and `backend/oauth/testing-and-debugging.adoc`. Add official links (Spring Security testing reference, Testcontainers, Spring Boot testing).
  - [x] Task 3.6. Record every missing tag or untested level in a scratch list for Task 10.
    - Note (scratch list for Task 10): the list is the 3.1 note above. Also for Task 9/10: `project-setup.adoc` (already merged) still says the workflows are not collected and the poms have no `tag::` regions, but the example now collects `.github/workflows/{build,docs}.yml` and tags `build.yml` and several poms; update that statement if Task 9 verification touches the page.

### Group 2 (Parallelizable: yes, a single task; it depends on Group 1 because it summarizes the three new pages)

- [x] Task 4. Write `index.adoc` (Building an Authorization Server from Scratch)
  - [x] Task 4.1. Create `../modules/ROOT/pages/backend/springboot/authorization-server-from-scratch/index.adoc` with the standard header (title `= Building an Authorization Server from Scratch`).
  - [x] Task 4.2. Section *What you build*: a short description with `image::springboot-authz-architecture.svg[…]` on one line (alt text quoted if it contains a comma), reusing the figure.
  - [x] Task 4.3. Feature matrix: method (password, TOTP, passkey, e-mail OTP / magic link, SMS OTP, social login, X.509, device grant) → primary / second factor → Spring mechanism → `amr` value → page. Flow matrix: flow (authorization code + PKCE, client credentials, token exchange, device, legacy implicit) → client → page. Read each page's content for names and `amr` values rather than guessing.
  - [x] Task 4.4. Sections *Prerequisites*, *Reading order* and *Clone and run the example* (link the repository and `xref:irurueta-auth-server::installation.adoc[]`; check that this target exists in the component first), and *Relationship to the OAuth Reference and to the Authorization Server & Social Login page* (`xref:`).
  - [x] Task 4.5. A list of every page (22 pages) with a one-line summary each, taken from each page's `:description:`.

### Group 3 (Parallelizable: yes, tasks touch disjoint files)

- [x] Task 5. Update `../modules/ROOT/nav.adoc`
  - [x] Task 5.1. Insert `***** xref:backend/springboot/authorization-server-from-scratch/index.adoc[Building an Authorization Server from Scratch]` after the `**** …spring-security-authorization-server.adoc[…]` line.
  - [x] Task 5.2. Change the 19 existing `*****` section lines to `******` and append, in #159 order after `client-credentials-and-service-to-service`, `api-reference.adoc[API Reference]`, `hardening-and-production.adoc[Hardening & Production]` and `testing.adoc[Testing the Authorization Server]` at `******`. Change no other line.
- [x] Task 6. Back-links and the landing page of the OAuth Reference
  - [x] Task 6.1. Add one **See also** line to `backend/springboot/spring-security-authorization-server.adoc`, pointing to the new section index, and an entry in its `== References`.
  - [x] Task 6.2. Add one **See also** line each to `backend/oauth/spring-boot-integration-overview.adoc`, `spring-boot-flow-recipes.adoc`, `spring-boot-authentication-methods.adoc`, `authentication-methods-2fa-and-passwordless.adoc`, `browser-based-apps.adoc` and `legacy-implicit-and-password-grants.adoc`, each pointing to the matching worked-example page (overview → index; flow recipes → client-credentials page; authentication methods → index; 2FA / passwordless → multi-factor-authentication; browser-based apps → backend-for-frontend; legacy implicit → implicit-flow-legacy-and-migration). Read each page first to find where its existing **See also** lines go.
  - [x] Task 6.3. Add one line to the reading guide of `backend/oauth/index.adoc` (under *Spring Boot integration*) pointing to the new section.
- [x] Task 7. Update `backend/springboot/index.adoc`: landing page and bibliography
  - [x] Task 7.1. Add the section under *Security* (after the line at 151 that describes the authorization-server page), extend `:description:` and `:keywords:` with the new terms (for example `Authorization Server from Scratch`, `passkeys`, `TOTP`, `BFF`, `step-up`).
  - [x] Task 7.2. Extend `== Bibliography` with every official source used across the section: Spring Security / Spring Authorization Server, Spring Session, Spring Cloud Gateway, springdoc, Antora Collector, RFC 4226 / 6238 / 6749 / 6750 / 7515 / 7517 / 7519 / 7523 / 7636 / 8176 / 8628 / 8693 / 8705 / 9068 / 9449 / 9470 / 9457 / 9700, OpenID Connect Core / Discovery / RP-Initiated Logout, the OAuth 2.1 draft, the browser-based-apps BCP, W3C WebAuthn Level 3, NIST SP 800-63B-4, OWASP Password Storage and ASVS, the Twilio and AWS SNS SDK docs, Mailpit, and the example repository. Before adding each entry, grep the existing bibliography and the section pages' own link lists so nothing is duplicated, and check that every link resolves (the URL is the one cited by the section pages).

### Group 4 (Parallelizable: yes, a single task; it runs last of the content tasks and is gated)

- [ ] Task 8. Switch the playbook to release branches and update `../CLAUDE.md`
  Deferred until `release_1.0.0` exists in irurueta-auth-server (decision recorded in the Task summary). If it still does not exist when this task is reached, skip Tasks 8.1 to 8.3, leave them unchecked and report them as deferred.
  - [ ] Task 8.1. Once `git ls-remote https://github.com/albertoirurueta/irurueta-auth-server` shows `release_1.0.0`: in `antora-playbook.yml:96-101`, replace `- main` with `release_1.{0..99}*` and `release_{2..99}*` like the other sources, and remove the "Tracks main until version 1.0.0" comment.
  - [ ] Task 8.2. In `../CLAUDE.md` (lines 31-33 and the `@antora/collector-extension` sentence), say that `irurueta-auth-server` now tracks release branches like the other sources, and that only `ai-catalog` tracks `main`.
  - [ ] Task 8.3. Re-run Task 9.1 and Task 9.6 against the release branch.

### Group 5 (Parallelizable: no, these tasks share one build and read the other groups' output)

- [x] Task 9. Full-section verification
  - [x] Task 9.1. Run `npx antora --fetch antora-playbook.yml` (delegate to the `iru-gate-runner` agent through the `iru-build-docs` skill so build logs do not fill the main context). It must report no errors or warnings for the section.
    - Note: `npx antora --fetch antora-playbook.yml` ran with exit 0 and no output at all (0 warnings, 0 errors); re-run after the `project-setup.adoc` fix, again 0 lines. Run directly rather than through `iru-gate-runner`.
  - [x] Task 9.2. Run the `../CLAUDE.md` grep checks (block `image::` macros closed on one line, inline `image:` macros, `<p>image::` in `build/site`, alt-text commas for the changed `.adoc` files, and the inline-code substitution scan) against `build/site/backend/springboot/authorization-server-from-scratch`, quoting every `--include` pattern. All must print nothing.
    - Note: block `image::` not closed, inline `image:` not closed, `<p>image::` in `../build/site`: all print nothing. Alt-text-comma check on the changed `.adoc` files: nothing for the new/edited lines; one hit at `spring-boot-integration-overview.adoc:218`, a pre-existing line (blame 1e58e9b3a0, not in this branch's diff). Inline-code substitution scan: nothing for `authorization-server-from-scratch`; hits remain only in pre-existing OAuth text (not in this branch's added lines).
  - [x] Task 9.3. Run `npm run validate:mermaid` (after the one-off `npm i --no-save mermaid@11 jsdom`); every diagram must parse, including the new ones.
    - Note: `npm i --no-save mermaid@11 jsdom` then `npm run validate:mermaid`: "All 3316 Mermaid diagrams parsed successfully." (before and after the fix).
  - [x] Task 9.4. List `modules/ROOT/images/springboot-authz-*.svg` and confirm each is referenced by at least one page.
    - Note: `springboot-authz-architecture.svg` is referenced by 2 pages and `springboot-authz-key-rotation.svg` by 1; no orphans.
  - [x] Task 9.5. Rendered-HTML scan of the section (and of the six OAuth pages and the two landing pages touched): no stray backticks, no `{name}` attribute warnings, no unrendered `include::` / `image::` / `xref:` text, following the rendered-HTML backtick scan notes in memory.
    - Note: scanned 32 rendered pages (section, seven OAuth pages incl. index, `backend/springboot/index`, `spring-security-authorization-server`): no stray backticks in this branch's text, no `pass:`, `include::`, `image::`, `xref:`, `{name}`, unresolved xref or anchor-in-code. Two pre-existing items left alone (outside this branch's diff): backticks around `@Version`/CAS and `Window<T>` in `backend/springboot/index.adoc` line 66, and a false positive on the word "pass:" in `signing-keys-jws-and-jwt.html`.
    - Fixed during verification (plan choice 7): `project-setup.adoc` said the poms, compose file and workflows have no `tag::` regions and the workflows are not collected; verified against the example (main, commit 2bcca58) and reworded the three sentences.
  - [x] Task 9.6. Check every `include::irurueta-auth-server::example$…[tag=…]` in the four new pages: the path exists and the tag exists in the example (cloned in the scratchpad, or via the Collector output). Repeat after Task 8 on the release branch.
    - Note: checked against `main` of the example clone (refreshed with `git pull`, up to date): 305 `include::irurueta-auth-server::example$` lines across the 23 section pages (four new pages: api-reference 7, testing 6, index 0, hardening-and-production 0); every path exists and every `tag=` exists, 0 bad. The repeat on the release branch is DEFERRED together with Task 8.
  - [x] Task 9.7. Check that every page in the section appears in `nav.adoc` exactly once, and that the index lists all of them.
    - Note: nav has 23 `authorization-server-from-scratch/` entries, the set equals the 23 `.adoc` files, each once; `index.adoc` xrefs all 22 other pages.
- [x] Task 10. Follow-up list for irurueta-auth-server
  - [x] Task 10.1. From the scratch lists of Tasks 1.1, 3.1 and 3.6, compile the missing tags and untested levels (for example tests with no `tag::`, OpenAPI regions with no tag) and report them to the user in the PR description as follow-up issues to open in irurueta-auth-server. Do not open issues without the user's confirmation.
    - Follow-up list for irurueta-auth-server (for the PR description; no issue opened, awaits user confirmation):
      1. Add `tag::` regions to unit tests (`TotpAlgorithmTest`, `TotpCodeVerifierTest`, `AesGcmKeyCipherTest`, `StepUpGuardTest`), `spring-security-test` slices (`jwt()` in the resource server's `SecurityConfigIT` and `ApiSecurityConfigIT`, `oidcLogin()` in the BFF ITs), the end-to-end tests (nine `*EndToEndIT` plus `SignInSmokeIT`), fixed-clock tests (`Clock.fixed`), `OpenApiContractTest`/`OpenApiDriftIT`, `LoggingSmsSender`/`SmsSenderProfilesIT` and `TestPki`/`TestCertificates`.
      2. Missing test code: no use of `oauth2Client()`, `opaqueToken()` or `@WithMockUser` post-processors, and no integration test moves the application `Clock` (they edit database timestamps and token claims).
      3. Capture the real `/.well-known/openid-configuration` output from a running instance and replace the assembled listing (and its NOTE) on the discovery page.
      4. Protocol and Spring Security authentication endpoints are not OpenAPI documents (by design); consider a contract document if tag-based includes are wanted.
      5. Optional: remaining `*-api-contract` and `*-page-api` OpenAPI regions are tagged and used by feature pages; no missing tags found in the OpenAPI files.
- [ ] Task 11. Closing the umbrella
  - [ ] Task 11.1. Make sure the PR description says `Closes #336` and `Closes #159`, and lists irurueta-auth-server 1.0.0 as the condition for merging after Task 8. Check the milestone counts with `gh` at review time (not a repository change).
    - Note (left UNCHECKED: the PR description does not exist yet; no PR opened or edited, no issue commented on): the PR description must say `Closes #336` and `Closes #159`, list the Task 10 follow-up list, and state that merging waits for irurueta-auth-server 1.0.0 (`release_1.0.0` branch) and Task 8 (playbook and `../CLAUDE.md` switch, deferred).
    - Milestone observed with `gh` (read-only): "SpringBoot Reference: Authorization Server from Scratch" (milestone 2) has open=2, closed=3. Closed: #343, #344, #345. Open: #336 and umbrella #159.
