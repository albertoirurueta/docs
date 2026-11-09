# Implementation Plan: Authorization Server from Scratch docs (1/4): aggregate irurueta-auth-server and write the Architecture, Project Setup and Data Model pages (issue #343)

## Task summary

Source: GitHub issue #343
Base branch: main

Issue [#343](https://github.com/albertoirurueta/docs/issues/343) (part of umbrella #159) asks to (1) make the site aggregate the
`irurueta-auth-server` Antora component, so pages can `include::irurueta-auth-server::example$…[tag=…]` its tagged code, using the
Antora Collector extension, and (2) write three foundation pages under
`modules/ROOT/pages/backend/springboot/authorization-server-from-scratch/`: `architecture.adoc`, `project-setup.adoc` and
`data-model.adoc`. The section `index.adoc` is #336, so nav lines nest under the existing *Authorization Server & Social Login* entry.

### Choices made on the user's behalf

1. **Playbook branch is `main`, not `develop`** (confirmed by the user). The issue says `develop`, but `irurueta-auth-server`'s `develop`
   holds only the setup commit: every code PR (#10 to #21) merged to `main`, which also carries the Collector config in
   `docs/antora.yml`, 192 `tag::` regions and the migrations. There are no release branches or tags. The playbook comment says
   that #336 switches this source to release branches.
2. **Pages follow the real code, not the umbrella's sketch.** The example is a hexagonal multi-module build per application
   (`auth-server/{domain,application,infrastructure/*,api/web,boot}`, `bff/…`, `resource-server/…`, `service-client/…`,
   `test-support`, `e2e-tests`), not the flat layout in #159. Include paths use the Collector `into:` targets declared in the
   example's `docs/antora.yml` (for example `example$auth-server/api/web/src/main/java/…`).
3. **The data model covers every table that exists on `main`, not only those after walking skeleton #1.** The example already
   has migrations `V100` to `V800` (and BFF `V300`). `== Tables added by later pages` lists the tables owned by #344 and #345
   (and #336 for the rest), each pointing at its migration, instead of an empty placeholder. Column tables are given for the
   custom schemas that this page owns (users, authorities, passwords); the other custom tables are summarised and left to the
   page that explains them.
4. **Project picker: add the example** (icon, nav entry, xref block), as the issue prefers, in a new `=== Spring Boot Examples`
   heading under *Open Source Projects* so it is not mixed into the Java library list. The nav entry goes in a matching new
   `** Spring Boot Examples` group.
5. **Tasks are untagged**: no installed `*-code-one-task` key fits AsciiDoc/YAML authoring, so tasks are implemented directly.
6. **Collector version.** `@antora/collector-extension` 1.0.3 is the latest. The example repo builds it with Antora 3.2.1 while
   this repo pins Antora 3.1.15. Task 4 verifies the combination; bumping Antora is a fallback only if the build fails, and is
   recorded in the PR if needed.
7. **`oauth-ref` attribute.** The example's pages link the OAuth Reference by URL. Our pages use `xref:backend/oauth/…` instead.

Open clarifications: none

## Acceptance criteria coverage

| # | Criterion | Covered by tasks |
|---|---|---|
| 1 | "`npx antora --fetch antora-playbook.yml` builds with the new source and the Collector extension, with no errors or warnings." | Task 1, Task 4, Task 9 |
| 2 | "The three pages and their nav lines exist (… nest the lines under the existing *Authorization Server & Social Login* entry)." | Task 5, Task 6, Task 7, Task 8 |
| 3 | "Every listing is an `example$` include followed by an official link." | Task 5, Task 6, Task 7, Task 9 |
| 4 | "The `CLAUDE.md` image / inline-code greps and `npm run validate:mermaid` are clean." | Task 9 |
| 5 | "Every new SVG is referenced." | Task 3, Task 5, Task 9 |
| 6 | derived: `CLAUDE.md` lists `irurueta-auth-server`, its `main` tracking until 1.0.0 and the Collector dependency | Task 2 |
| 7 | derived: the picker has an icon, a nav entry and an `xref:irurueta-auth-server::index.adoc[]` block | Task 3 |
| 8 | derived: one `include::irurueta-auth-server::example$…[tag=…]` and the cross-component xref resolve in the build | Task 4 |
| 9 | derived: `publish.yml` and `manual_publish.yml` install the Collector extension | Task 1 |

## Current code state

- `antora-playbook.yml`: `content.sources` has `url: .` plus 15 remote repos, each with `start_path: docs`. `antora.extensions` has only
  `@sntke/antora-mermaid-extension` (Lunr is commented out). No Collector.
- `package.json` dependencies: `@antora/lunr-extension`, `@djencks/asciidoctor-mathjax`, `@sntke/antora-mermaid-extension`;
  devDependency `antora` 3.1.15. `.github/workflows/publish.yml` and `manual_publish.yml` differ only in the trigger and run
  `npm i -D -E antora` plus one `npm i` per extension, then `validate-mermaid.mjs`, then `npx antora antora-playbook.yml`.
- `CLAUDE.md` "Architecture" lists the remote sources (up to `ai-catalog`) and the extensions (Mermaid, MathJax, Lunr off).
- `modules/ROOT/pages/index.adoc` has `=== AI` and `=== Java Projects` headings, each followed by a 3-column
  `[cols="1,1,1",frame=none,grid=none]` table of `image::<icon>.svg[xref="<component>::index.adoc"]` cells (one-line macros).
  `modules/ROOT/nav.adoc` has `* Open Source Projects` with `** AI` and `** Java Projects`. Icons live in `modules/ROOT/images/`.
- Target directory `modules/ROOT/pages/backend/springboot/authorization-server-from-scratch/` does not exist.
  `modules/ROOT/nav.adoc:1450` is `**** xref:backend/springboot/spring-security-authorization-server.adoc[Authorization Server & Social Login]`.
  `partials/springboot-disclaimer.adoc` exists. Page style: `:description:`, `:keywords:`, then `include::partial$springboot-disclaimer.adoc[]`.
- Related pages to `xref:`: `backend/oauth/spring-boot-integration-overview.adoc`, `backend/oauth/browser-based-apps.adoc`,
  `backend/springboot/spring-security.adoc`, `configuration-and-profiles.adoc`, `unit-and-integration-testing.adoc`,
  `backend/docker/*`. The sibling docs issues #344 and #345 (2/4 and 3/4) are open and #336 is 4/4.
- Example repo (`albertoirurueta/irurueta-auth-server`, branch `main`): `docs/antora.yml` (component `irurueta-auth-server`, version `1.0.0`)
  holds `ext.collector` scans that copy each module's `src/**`, `apis/**/*.yaml`, `pom.xml` and `compose.yaml` into `example$`.
  Tags relevant here: `security-chains`, `login-chain` family, `passkeys-chain-customizer`, `x509-login-method-fragment`,
  `mfa-second-factor-fragment`, `jdbc-services`, `keys-schemas`, `account-schemas`, `clients-schemas`, `ott-schemas`
  (full list from `grep -rn 'tag::'`). Migrations: `auth-server/infrastructure/persistence/src/main/resources/db/migration/V100…V800`
  and `bff/infrastructure/session/src/main/resources/db/migration/V300__spring_session.sql`. `compose.yaml` runs `postgres:18` and Mailpit.

## Implementation steps

### Group 1 (Parallelizable: yes — the tasks touch disjoint files)

- [x] Task 1. Wire the Collector extension into the build
  - [x] Task 1.1. `antora-playbook.yml`: add the `irurueta-auth-server` source (`url: https://github.com/albertoirurueta/irurueta-auth-server.git`,
    `branches: [main]`, `start_path: docs`) after `ai-catalog`, with a comment explaining it tracks `main` until 1.0.0 is released and that #336
    switches it to `release_1.{0..99}*` / `release_{2..99}*`.
  - [x] Task 1.2. `antora-playbook.yml`: under `antora.extensions` add `- require: '@antora/collector-extension'` (confirm the registration form
    against https://docs.antora.org/collector-extension/latest/register/ before writing it).
  - [x] Task 1.3. `package.json`: add `"@antora/collector-extension": "^1.0.3"` to `dependencies`; run `npm install` to update `package-lock.json`.
  - [x] Task 1.4. `.github/workflows/publish.yml` and `.github/workflows/manual_publish.yml`: add `npm i @antora/collector-extension` next to the other
    extension installs.
- [x] Task 2. Update `CLAUDE.md`
  - [x] Task 2.1. Add `irurueta-auth-server` to the list of remote content sources and say it tracks `main` until its 1.0.0 release.
  - [x] Task 2.2. In the extensions paragraph, add `@antora/collector-extension` and state that the site now depends on it, because the example's
    `docs/antora.yml` uses `ext.collector` to populate its `example$` family and the pages' includes fail without it.
- [x] Task 3. Add the project picker entry
  - [x] Task 3.1. Create `modules/ROOT/images/irurueta-auth-server.svg`, in the style of the existing project icons (check `ai-catalog.svg` and `hermes.svg` for size and
    palette).
  - [x] Task 3.2. `modules/ROOT/nav.adoc`: add `** Spring Boot Examples` with `*** xref:irurueta-auth-server::index.adoc[Auth Server]` after the Java Projects group.
  - [x] Task 3.3. `modules/ROOT/pages/index.adoc`: add a `=== Spring Boot Examples` heading, a one-sentence description and a 3-column table whose first cell is
    `image::irurueta-auth-server.svg[xref="irurueta-auth-server::index.adoc"]`, keeping every macro on one line.

### Group 2 (Parallelizable: yes — a single task)

- [x] Task 4. Prove the include path
  - [x] Task 4.1. Run `npx antora --fetch antora-playbook.yml`. Check that the build has no errors or warnings and that
    `build/site/irurueta-auth-server/` exists with the example component's pages.
  - [x] Task 4.2. Add a throwaway page that contains one `include::irurueta-auth-server::example$auth-server/api/web/src/main/java/com/irurueta/authserver/authorization/api/web/SecurityConfig.java[tag=security-chains]`
    and an `xref:irurueta-auth-server::index.adoc[]`. Confirm both resolve in the rendered HTML, then delete the throwaway page (the real proof
    stays in Tasks 5 to 7 and 9). If the build fails with Antora 3.1.15, record the exact error, and try the smallest fix (bump Antora to the version the example uses).

### Group 3 (Parallelizable: yes — one file each; only the SVG in Task 5 is shared by nothing else)

- [x] Task 5. Write `architecture.adoc` (documents irurueta-auth-server#1)
  - Files: `modules/ROOT/pages/backend/springboot/authorization-server-from-scratch/architecture.adoc`, `modules/ROOT/images/springboot-authz-architecture.svg`. Tags: `security-chains`, `passkeys-chain-customizer`, `x509-login-method-fragment`. Antora build clean, 3 Mermaid diagrams parse.
  - [x] Task 5.1. Create `springboot-authz-architecture.svg` in `modules/ROOT/images/` with the trust boundaries (browser, BFF, AS, RS, external IdPs, mail / SMS), adapted
    from the Mermaid flowchart in #159 and from the real modules (`auth-server`, `bff`, `resource-server`, `service-client`).
  - [x] Task 5.2. Page header (`:description:`, `:keywords:`, the disclaimer) and a components-and-ports section: one table row per module and port, taken from the
    code. Reference it with a one-line `image::springboot-authz-architecture.svg["…",width=…]` macro.
  - [x] Task 5.3. A Mermaid `sequenceDiagram` of the end-to-end sign-in (SPA → BFF `/oauth2/authorization/…` → AS `/oauth2/authorize` → login → code → BFF token request → session
    cookie → API call relayed with a bearer token → RS validates through JWKS). Use `&lt;&lt;…&gt;&gt;` entities for any stereotype, per `CLAUDE.md`.
  - [x] Task 5.4. A Mermaid flowchart of the `auth-server` filter chains (protocol chain `@Order(1)`, login / UI chain `@Order(2)`, API chains) checked against `SecurityConfig.java`,
    plus a `[source,java]` block that includes `tag=security-chains` via `include::irurueta-auth-server::example$…`.
  - [x] Task 5.5. Package-per-feature and the `LoginChainCustomizer` / `LoginMethodFragment` extension design, with includes for `passkeys-chain-customizer`
    and `x509-login-method-fragment` (or the closest existing tags). State that the example is never deployed.
  - [x] Task 5.6. After every listing, one link to the official page it derives from (Spring Authorization Server overview and *Getting Started*, Spring Security architecture, the OAuth 2.1 draft),
    and `xref:`s to `backend/oauth/spring-boot-integration-overview.adoc` and `backend/oauth/browser-based-apps.adoc`.
- [x] Task 6. Write `project-setup.adoc` (documents the setup PR and irurueta-auth-server#1)
  - File: `.../authorization-server-from-scratch/project-setup.adoc`. Tags: `clients-seed` (DefaultClientDefinitions), `clients-seed-config` (application.yml). No pom, compose or workflow tags exist in the example: described in prose; follow-up issue to open in irurueta-auth-server (tag pom dependencies, compose.yaml, application-dev.yml, DevDataInitializer).
  - [x] Task 6.1. Header, disclaimer, and cloning the example repository (`git clone`, Java 21, Maven wrapper).
  - [x] Task 6.2. A module-by-module starter table with the Boot 4.1 names (for example `spring-boot-starter-security-oauth2-authorization-server`) and why each is there, verified against
    the poms with `include::irurueta-auth-server::example$…pom.xml[tag=…]` where a tag exists. If a pom has no suitable tag, open a follow-up issue in `irurueta-auth-server` instead of pasting code.
  - [x] Task 6.3. Profiles (`dev`, `test`, and the later `legacy-implicit`, `twilio`, `sns`, named in prose without `xref:` to pages that don't exist yet), `compose.yaml` with `spring-boot-docker-compose`
    (included from `example$compose.yaml`), the run order and the seeded demo users and clients (read the seed tag; do not repeat credential values outside what the repo's seed already shows).
  - [x] Task 6.4. How these pages show code (tags, Collector), how to run the tests, and the test-only CI workflow, each followed by its official link. `xref:` to
    `backend/springboot/unit-and-integration-testing.adoc` and `configuration-and-profiles.adoc`.
- [x] Task 7. Write `data-model.adoc` (documents irurueta-auth-server#1; extended by #344 and #345)
  - File: `.../authorization-server-from-scratch/data-model.adoc`. Tags: `users-schema` (V101), `sas-schema` (V100). One erDiagram.
  - [x] Task 7.1. Header, disclaimer, and a Mermaid `erDiagram` of the tables that exist after #1: `users`, `user_authorities`, `user_passwords` and the three Spring Authorization Server tables
    (`oauth2_registered_client`, `oauth2_authorization`, `oauth2_authorization_consent`). Mark Spring-defined schemas versus custom ones.
  - [x] Task 7.2. Column tables for the custom schemas, built from `V101__users.sql` (and `V100` for the Spring ones, linked to the official schema).
  - [x] Task 7.3. The Flyway layout (module location, `classpath:db/migration`, the per-code-issue version ranges `V1xx`, `V2xx`, …) as a table.
  - [x] Task 7.4. `== Tables added by later pages`: one entry per table from `V200` to `V800` and the BFF `V300`, naming the page that will explain it (#344, #345 or #336), without `xref:` to pages that
    don't exist yet.

### Group 4 (Parallelizable: no — Task 8 edits `nav.adoc`, which Task 3.2 also edits, and Task 9 verifies everything)

- [x] Task 8. Add the nav lines
  - [x] Task 8.1. `modules/ROOT/nav.adoc`, after line 1450: add `***** xref:backend/springboot/authorization-server-from-scratch/architecture.adoc[Architecture]`,
    `…/project-setup.adoc[Project Setup & Running the Example]` and `…/data-model.adoc[Data Model & Schema]`, nested under `Authorization Server & Social Login`.
    Add only these three lines (the section index and the other pages are #336, #344, #345).
- [x] Task 9. Full verification (delegate each build or grep run to `iru-gate-runner` or run it in a shell, and keep the output out of the main context)
  - [x] Task 9.1. `npx antora --fetch antora-playbook.yml` ends with no errors or warnings, and `build/site/backend/springboot/authorization-server-from-scratch/` has the three pages with their
    includes rendered (no `Unresolved directive`).
  - [x] Task 9.2. The `CLAUDE.md` image greps (block and inline macros closed on one line; no `<p>image::` in `build/site`), the unquoted-comma alt-text grep on the three changed pages and
    the inline-code grep on `build/site/backend/springboot/authorization-server-from-scratch`, all printing nothing.
  - [x] Task 9.3. `npm i --no-save mermaid@11 jsdom && npm run validate:mermaid` reports every diagram as parsed.
  - [x] Task 9.4. Check that `springboot-authz-architecture.svg` and `irurueta-auth-server.svg` are each referenced by a page, and that every `image::` target exists in `modules/ROOT/images/`.
  - [x] Task 9.5. Scan the rendered text of the three pages for the defects the greps miss (stray backticks, bare `+`, `[[x]]`), and check that every listing is followed by an official link.
  - [x] Task 9.6. Run `/iru-check-security` on the changed files. Treat detect-secrets findings in this docs repo as false positives only after reading each one.
