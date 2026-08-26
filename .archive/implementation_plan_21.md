# Implementation Plan: Web Development / "What is CORS?"

## Task summary

Source: GitHub issue #21

Issue [#21](https://github.com/albertoirurueta/docs/issues/21) ("What is CORS") asks for a new documentation
page within the existing **Guides & References / Web Development** section explaining what CORS
(Cross-Origin Resource Sharing) is: a *browser-only* enforcement mechanism (not a server-side security
control — tools like `curl`/Postman never go through it), covering the `Origin` header, the simple-vs-preflight
request distinction, the CORS response headers, and how to validate origins correctly on the backend (explicit
allowlist, `Vary: Origin`, correctly anchored matching) versus common mistakes (`Access-Control-Allow-Origin: *`
combined with `Access-Control-Allow-Credentials: true`, reflecting the `Origin` header unvalidated, an
unanchored regex, relying on `Referer` instead of `Origin`). The issue supplies detailed reference content to
ground the page, explicitly invites going deeper on cross-origin credentials/framework-specific config, and asks
for mermaid diagrams of the browser/server request flow and any figures in SVG format.

**Choices made on the user's behalf** (nothing here is genuinely ambiguous enough to block on):

- **Placement: a standalone page directly under `web/`, not nested inside an existing subsection.** Every
  existing entry under Web Development (`html-css/`, `sass/`, `javascript/`, `bootstrap/`) is a full
  book/framework-grounded reference subsection with its own index page. CORS is a general web-platform/security
  concept that spans both the browser and the backend server, not something owned by any one of those four
  subsections (JavaScript's `browser-networking.adoc` already mentions CORS in passing, in a `fetch()`-specific
  context — see below). The issue itself says "within Web Development", not "within JavaScript Development", so
  this plan adds `modules/ROOT/pages/web/cors.adoc` as a sibling of `web/html-css/`, `web/sass/`,
  `web/javascript/`, and `web/bootstrap/` (a leaf page, not a new subsection with its own index), and lists it
  directly in `web/index.adoc`'s "Sections" list.
- **New disclaimer partial.** Every existing subsection has its own AI-generated-content disclaimer partial
  (`html-css-disclaimer.adoc`, `sass-disclaimer.adoc`, `javascript-disclaimer.adoc`, `bootstrap-disclaimer.adoc`),
  included at the top of each of its pages. Since this new page isn't part of any of those subsections, it needs
  its own: `modules/ROOT/partials/cors-disclaimer.adoc`, following the no-single-book pattern used by
  `bootstrap-disclaimer.adoc`/`sass-disclaimer.adoc` (content generated with AI assistance from general
  knowledge, no single reference book), pointing readers at MDN's CORS documentation and the Fetch/WHATWG
  Fetch Standard as the source of truth to verify against.
- **Cross-link from the existing brief mention.** `modules/ROOT/pages/web/javascript/browser-networking.adoc`
  already has a short paragraph on CORS (under `=== File Uploads and Cross-Origin Requests`, next to the
  `fetch()` `mode` option). That paragraph gets a one-line `xref:web/cors.adoc[]` pointer to the new page instead
  of duplicating the explanation, so the fuller treatment lives in exactly one place.
- **Diagrams**: one `[mermaid]` sequence diagram for the simple-request flow (browser → server → browser) and
  one for the preflight flow (`OPTIONS` handshake, then the actual request) — the existing pattern used by e.g.
  `web/html-css/layout.adoc` and `web/bootstrap/javascript-behavior.adoc`. No SVG figure is needed beyond the
  diagrams themselves — the issue's own content is entirely request/header flow and code, which mermaid covers
  more accurately than a static image; if scoping a figure turns out to add real value while writing the page
  (e.g. an allowlist-vs-wildcard comparison graphic), add it under `modules/ROOT/images/` following the existing
  SVG convention (e.g. `box-model.svg`, `bootstrap-navbar.svg`), but this is not pre-planned as a separate task.

## Current code state

- This repository has no application source code — it *is* the Antora playbook + root (`irurueta`) component for
  the aggregated "Irurueta Docs" site. All content lives under `modules/ROOT/`.
- `modules/ROOT/nav.adoc` lines 31-124 define the **Web Development** section (`** xref:web/index.adoc[...]`),
  currently with four `***` sub-references, each with its own `****`-nested page list: HTML & CSS Reference
  (`web/html-css/`), Sass Reference (`web/sass/`), JavaScript Development (`web/javascript/`), and Bootstrap
  Reference (`web/bootstrap/`).
- `modules/ROOT/pages/web/index.adoc` is the Web Development landing page: a short intro plus a `== Sections`
  bulleted list, one `xref:` bullet per subsection with a one-line summary.
- Each subsection has its own disclaimer partial under `modules/ROOT/partials/` (`html-css-disclaimer.adoc`,
  `sass-disclaimer.adoc`, `javascript-disclaimer.adoc`, `bootstrap-disclaimer.adoc`), included via
  `include::partial$<name>-disclaimer.adoc[]` right after each page's `= Title` / `:description:` / `:keywords:`
  header block. Every page follows this exact header shape (see e.g.
  `modules/ROOT/pages/database/sql/normalization.adoc` or `modules/ROOT/pages/web/javascript/exception-handling.adoc`,
  both single-page additions to an existing section, added by `.archive/implementation_plan_20260823190147.md`).
- `modules/ROOT/pages/web/javascript/browser-networking.adoc` (`=== File Uploads and Cross-Origin Requests`,
  around line 166) has a short existing paragraph explaining `Origin`/`Access-Control-Allow-Origin` in the
  context of `fetch()`'s cross-origin behavior — this plan cross-links it rather than duplicating it.
- Mermaid diagrams are already in use via `[mermaid]` blocks (e.g. `modules/ROOT/pages/web/bootstrap/javascript-behavior.adoc`,
  `modules/ROOT/pages/web/html-css/layout.adoc`), backed by the `@sntke/antora-mermaid-extension` wired up in
  `antora-playbook.yml` — no new tooling is needed.
- No `*-code-one-task` skill applies (AsciiDoc documentation content, not application code in a language this
  repository's installed skills cover) — the single task below is left untagged and implemented directly.

## Implementation steps

### Group 1

**Parallelizable: yes** (single task)

- [x] Task 1. Create the CORS disclaimer partial —
  `modules/ROOT/partials/cors-disclaimer.adoc`
  - [x] Task 1.1. Create `modules/ROOT/partials/cors-disclaimer.adoc`, an `[IMPORTANT]` admonition following the
    exact structure of `modules/ROOT/partials/bootstrap-disclaimer.adoc`/`sass-disclaimer.adoc` (no single
    reference book underpinning the content): state that this page documents general Cross-Origin Resource
    Sharing (CORS) behavior as specified by the WHATWG Fetch Standard, generated with AI assistance from general
    knowledge, and should be verified against https://fetch.spec.whatwg.org/#http-cors-protocol[the Fetch
    Standard's CORS protocol section] and https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS[MDN's
    CORS guide] before relying on it in production, since backend framework-specific CORS configuration (e.g.
    Express, Django, Spring) is out of scope for this page and left to each framework's own documentation.
  - Files: `modules/ROOT/partials/cors-disclaimer.adoc` created (AsciiDoc content only, no tests/coverage/quality
    tooling applies to this repository).

### Group 2

**Parallelizable: yes** (single task, depends on Group 1's partial existing to include)

- [x] Task 2. Write the "What is CORS?" page — `modules/ROOT/pages/web/cors.adoc`
  - [x] Task 2.1. Create `modules/ROOT/pages/web/cors.adoc` with the standard header block:
    `= What is CORS?`, a `:description:` summarizing the page (browser-enforced same-origin policy relaxation,
    simple vs. preflight requests, backend origin validation, common mistakes), and a `:keywords:` line (e.g.
    `CORS, Cross-Origin Resource Sharing, same-origin policy, Origin header, preflight request, OPTIONS,
    Access-Control-Allow-Origin, Access-Control-Allow-Credentials, Access-Control-Allow-Methods,
    Access-Control-Allow-Headers, Vary header, allowlist, web security`), followed by
    `include::partial$cors-disclaimer.adoc[]`.
  - [x] Task 2.2. `== What CORS Is` — explain CORS as a *browser* mechanism that relaxes the same-origin policy
    at the server's discretion; explicitly state it is not a server-side security measure and does not protect
    an API from direct server-to-server requests or tools like `curl`/Postman, since there is no browser present
    to enforce it. Cover the same-origin definition (protocol + hostname + port must all match).
  - [x] Task 2.3. `== The Origin Header` — the browser automatically attaches `Origin: <scheme>://<host>[:<port>]`
    to cross-origin requests, not modifiable by page JavaScript.
  - [x] Task 2.4. `== Simple vs. Preflight Requests` — the "simple request" criteria (`GET`/`POST`/`HEAD`,
    allowed content types, no custom headers) that skip preflight, versus everything else (`PUT`/`DELETE`/`PATCH`,
    `Content-Type: application/json`, custom headers like `Authorization`) triggering an `OPTIONS` preflight with
    `Access-Control-Request-Method`/`Access-Control-Request-Headers`. Include a `[mermaid]` sequence diagram
    (`sequenceDiagram`, participants Browser/Server) for the preflight handshake followed by the actual request,
    and either a second, simpler sequence diagram or a short comparison table for the simple-request case.
  - [x] Task 2.5. `== Server Response Headers` — document `Access-Control-Allow-Origin`,
    `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers`, `Access-Control-Allow-Credentials`, and how
    the browser compares the actual request's `Origin` against what the server allowed before letting JS read
    the response (versus the request having already run server-side either way).
  - [x] Task 2.6. `== Validating Origins on the Backend` — the explicit-allowlist pattern (reproduce/adapt the
    issue's Node/Express-style snippet as a `[source,javascript]` example, including `Vary: Origin`), framed as
    a general backend pattern applicable regardless of language/framework.
  - [x] Task 2.7. `== Common Mistakes` — as a bulleted or table breakdown: `Access-Control-Allow-Origin: *`
    combined with `Access-Control-Allow-Credentials: true` (browsers reject this; explain why it would be a
    serious vulnerability if it worked); reflecting the received `Origin` header back unvalidated (equivalent to
    allowing any origin); an unanchored allowlist regex (e.g. `/example\.com$/`) letting
    `evil-example.com`/`example.com.attacker.com` slip through; relying on `Referer` instead of `Origin` for
    validation.
  - [x] Task 2.8. `== CORS Does Not Replace Authentication` — closing section restating that CORS is a
    browser-side access-control layer on top of, never a substitute for, real authentication/authorization
    (tokens, sessions, API keys).
  - [x] Task 2.9. Add a `xref:web/cors.adoc[]` cross-reference from
    `modules/ROOT/pages/web/javascript/browser-networking.adoc`'s existing `=== File Uploads and Cross-Origin
    Requests` paragraph (the one already explaining `Origin`/`Access-Control-Allow-Origin` around line 166),
    pointing readers at the new page for the full explanation instead of leaving the two explanations
    duplicated.
  - Files: `modules/ROOT/pages/web/cors.adoc` created (all 8 sections + 2 mermaid sequence diagrams);
    `modules/ROOT/pages/web/javascript/browser-networking.adoc` updated with an `xref:web/cors.adoc[]` pointer.
    AsciiDoc content only — no tests/coverage/quality tooling applies to this repository.

### Group 3

**Parallelizable: no** — depends on `web/cors.adoc` (Group 2) existing to link to.

- [x] Task 3. Wire the new page into the site's navigation and landing page
  - [x] Task 3.1. Add `*** xref:web/cors.adoc[What is CORS?]` to `modules/ROOT/nav.adoc`, directly under the
    `** xref:web/index.adoc[Web Development]` line's own bullet (i.e. as a `***`-level entry, a sibling of
    `xref:web/html-css/index.adoc[...]`/`xref:web/sass/index.adoc[...]`/`xref:web/javascript/index.adoc[...]`/
    `xref:web/bootstrap/index.adoc[...]`, not nested under any of them) — placed first, before the four existing
    subsections, since it's a short standalone concept page rather than a multi-page reference.
  - [x] Task 3.2. Add a bullet to `modules/ROOT/pages/web/index.adoc`'s `== Sections` list:
    `xref:web/cors.adoc[What is CORS?] -- what Cross-Origin Resource Sharing is, how the browser and server
    negotiate it, and how to validate origins correctly on the backend.`, placed first in the list to match nav
    ordering.
  - [x] Task 3.3. Build the Antora site locally (`npx antora antora-playbook.yml`, per this repository's
    `CLAUDE.md`) and confirm it completes without `xref`/AsciiDoc errors, and that the new nav entry, page, and
    the updated `browser-networking.adoc` cross-reference all render correctly in `build/site`. Delegate this to
    the `iru-gate-runner` agent so the build log doesn't consume the main context window:
    ```
    Agent({
      description: "Build Antora docs site and verify no errors",
      subagent_type: "iru-gate-runner",
      prompt: "Run `npx antora antora-playbook.yml` at the repository root (/Users/albertoirurueta/repositories/common/docs).
        Report back only: whether the build completed successfully, any xref/AsciiDoc errors or warnings (with
        file/line), and confirmation that modules/ROOT/pages/web/cors.adoc, the updated nav.adoc entry, and the
        updated web/javascript/browser-networking.adoc cross-reference all appear in the generated build/site
        output. Do not paste the full build log."
    })
    ```
  - Build succeeded (exit code 0, no xref/AsciiDoc errors or warnings). Confirmed `build/site/web/cors.html`
    generated, nav entry present, and the `browser-networking.adoc` cross-reference resolved (class `xref page`,
    not `unresolved`).
