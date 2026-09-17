# Implementation Plan

## Task summary

Add a new Antora reference page, **"E2E Testing in Real Browsers"**, to the *Web Development* section, covering
Selenium, Playwright, and Cypress for end-to-end browser testing: what each tool is/how it's architected,
installation, headless vs. headed execution, evidence capture (screenshots/video/traces), running locally,
running in CI/CD (with example GitHub Actions workflows), a cross-tool comparison, and a short survey of
adjacent tools (Puppeteer, WebdriverIO, TestCafe, Robot Framework + Browser library). This repository is only
the Antora playbook/root component (see `CLAUDE.md`) — the whole task is content work under `modules/ROOT`, no
application code changes.

The issue's original title referenced "Vercel-Cypress"; the issue body itself already carries a maintainer
correction that no such product exists and every reference should read as plain **Cypress** (developed by
Cypress.io, unaffiliated with Vercel). This plan follows that correction throughout.

No ambiguity requiring a user decision was found — the issue is unusually specific about file paths, page
structure, exact content to cover per tool, and acceptance criteria, so this plan follows it directly rather
than asking anything upfront.

Source: GitHub issue #122
Base branch: main

## Current code state

- **`modules/ROOT/nav.adoc:238-241`** — the `Web Development` section starts with `xref:web/index.adoc[Web
  Development]`, followed immediately by two flat (`***`-level) standalone entries, `xref:web/cors.adoc[What is
  CORS?]` and `xref:web/accessibility.adoc[Web Accessibility]`, *before* the framework sub-trees (`html-css`,
  `sass`, `bootstrap`, `jquery`, `react`, `angular`, `aspnet`, `tailwind`, `vue`, `vaadin`, each nested under its
  own `***`/`****` entries). The new page's nav entry goes in this same flat group, after Accessibility and
  before `html-css`.
- **`modules/ROOT/pages/web/index.adoc`** — has an `== Sections` bullet list, one `xref:` + one-line summary per
  page, in the same order as `nav.adoc`. CORS and Accessibility are the first two bullets.
- **`modules/ROOT/pages/web/cors.adoc`** and **`modules/ROOT/pages/web/accessibility.adoc`** are the structural
  precedent named in the issue: AsciiDoc `=` title, a `:description:` and `:keywords:` attribute line, then
  `include::partial$<slug>-disclaimer.adoc[]` as the very first line of body content, then prose sections using
  `[cols="…"]` tables and `[mermaid]` diagrams where useful.
- **`modules/ROOT/partials/accessibility-disclaimer.adoc`** is the disclaimer-partial style to imitate: an
  `[IMPORTANT]` admonition block stating the content has no single backing reference book, was assembled with AI
  assistance from the tools' official docs, and should be verified against those docs before relying on it in
  production.
- **No `modules/ROOT/pages/web/e2e-testing-real-browsers.adoc`** and **no
  `modules/ROOT/partials/e2e-testing-disclaimer.adoc`** exist yet — both are new files.
- **Existing lightweight E2E content to cross-reference, not duplicate:**
  - `modules/ROOT/pages/web/react/testing.adoc` — has a full `== End-to-end tests` section (~line 160) already
    covering Playwright/Cypress with code snippets.
  - `modules/ROOT/pages/web/vue/testing.adoc` — has a full `== End-to-end with Cypress or Playwright` section
    (line 194) with code snippets for both tools.
  - `modules/ROOT/pages/web/vaadin/testing.adoc` — has a `== Playwright and Selenium` section (line 75)
    describing testing a running Vaadin app with plain Playwright for Java / raw Selenium.
  - `modules/ROOT/pages/web/angular/testing.adoc` — has **no** existing e2e/Cypress/Playwright content at all
    (confirmed by search); it just needs a short pointer added.
- **`.github/workflows/publish.yml`** shows this repo's own CI house style (Node 24, `actions/checkout@v5`,
  `actions/setup-node@v4`) — referenced only for tone/format when writing the *documented* (not executed)
  GitHub Actions snippets for Selenium/Playwright/Cypress, since this repo doesn't itself run those tools.
- Antora build verification method (per `CLAUDE.md`): `npx antora antora-playbook.yml` must complete without
  `xref`/AsciiDoc errors; CI (`.github/workflows/publish.yml`) also runs `scripts/validate-mermaid.mjs` against
  any `[mermaid]` blocks before the real build.

## Implementation steps

### Group 1 — New page and disclaimer partial

Parallelizable: yes (two independent new files; Task 2 only needs to know Task 1's exact filename, not its
finished content, to write a correct `include::partial$…[]` line).

- [x] Task 1. Create the disclaimer partial `modules/ROOT/partials/e2e-testing-disclaimer.adoc`
  - [x] Task 1.1. Write an `[IMPORTANT]` admonition block, following
    `modules/ROOT/partials/accessibility-disclaimer.adoc`'s pattern: state that this page has no single backing
    reference book, was assembled with AI assistance from the official documentation of Selenium, Playwright,
    and Cypress (plus the other tools it surveys), and should be checked against those tools' own docs
    (link each: https://www.selenium.dev/documentation/[Selenium], https://playwright.dev/docs/intro[Playwright],
    https://docs.cypress.io/[Cypress]) before relying on it in production.

- [x] Task 2. Create the main page `modules/ROOT/pages/web/e2e-testing-real-browsers.adoc`
  - [x] Task 2.1. Page header: `= E2E Testing in Real Browsers` title, a `:description:` attribute summarizing
    the page (Selenium/Playwright/Cypress for e2e testing, installation, headless/headed, evidence capture,
    CI/CD, comparison), a `:keywords:` attribute (Selenium, WebDriver, Playwright, Cypress, e2e testing,
    end-to-end testing, headless browser, screenshots, video recording, trace viewer, GitHub Actions, Puppeteer,
    WebdriverIO, TestCafe, Robot Framework), then `include::partial$e2e-testing-disclaimer.adoc[]` as the first
    line of body content, matching `cors.adoc`/`accessibility.adoc`'s ordering exactly.
  - [x] Task 2.2. Short intro paragraph framing the page: real-browser e2e testing as the top of the test
    pyramid, and a one-line scope note that framework-specific lightweight examples live on each framework's own
    testing page (linking `xref:web/react/testing.adoc[]`, `xref:web/vue/testing.adoc[]`,
    `xref:web/angular/testing.adoc[]`, `xref:web/vaadin/testing.adoc[]`), while this page is the deeper
    tool-focused reference.
  - [x] Task 2.3. `== Selenium` section covering: architecture (drives real browsers via the W3C **WebDriver**
    protocol, a per-browser driver process); installation (per-language bindings — Java/Maven-Gradle,
    Python/pip, JS-Node/npm, C#/NuGet, Ruby/gem, Kotlin — **Selenium Manager**, bundled since Selenium 4.6,
    auto-resolving/downloading the matching driver; optional **Selenium Grid**/Docker
    `selenium/standalone-chrome`, `selenium/hub` + nodes for remote/parallel runs); headless vs. headed
    (browser-specific flags, e.g. Chrome/Edge `--headless=new`, Firefox `-headless`, via
    `ChromeOptions`/`FirefoxOptions`); evidence capture (`driver.get_screenshot_as_file(...)` /
    `((TakesScreenshot) driver).getScreenshotAs(...)` — manual, on-demand only, typically wired into a
    test-failure hook; no built-in video); running locally (language-appropriate test runner invocation, e.g.
    `mvn test`, `pytest`); a runnable GitHub Actions snippet running headless Chrome (or a
    `selenium/standalone-chrome` service container) with `actions/upload-artifact` uploading captured
    screenshots.
  - [x] Task 2.4. `== Playwright` section covering: architecture (talks to Chromium DevTools Protocol / Firefox
    & WebKit's own protocols from a single Node/Java/Python/.NET library, no per-browser driver process);
    installation (`npm init playwright@latest` scaffolds config + example tests; `npx playwright install`
    downloads its own bundled Chromium/Firefox/WebKit builds; also `pytest-playwright`, Java, .NET bindings);
    headless vs. headed (headless by default; `{ headless: false }` or `npx playwright test --headed`; **UI
    Mode** `--ui`; **Trace Viewer** for post-run step-by-step inspection); evidence capture (`page.screenshot()`
    on demand, plus automatic `screenshot: 'only-on-failure'`, `video: 'retain-on-failure'`,
    `trace: 'on-first-retry'` config, and the Trace Viewer replaying the full DOM/network/console timeline);
    running locally (`npx playwright test`); a runnable GitHub Actions snippet using the official
    `mcr.microsoft.com/playwright` Docker image (or `npx playwright install --with-deps`) with
    `actions/upload-artifact` uploading the `playwright-report`/traces/videos.
  - [x] Task 2.5. `== Cypress` section covering: architecture (runs inside the browser itself, in the same
    run-loop as the app under test — not out-of-process); installation (`npm install cypress --save-dev`, a
    single all-in-one package: test runner + bundled Electron browser, JS/TS only; also detects/launches locally
    installed Chrome/Edge/Firefox); headless vs. headed (`cypress run` headless by default, used in CI;
    `cypress open` launches the interactive Test Runner headed, for local development); evidence capture
    (automatic screenshots on failure and full video recording of the whole run out of the box; optional
    **Cypress Cloud** to store/share run artifacts and video across CI runs); running locally (`npx cypress
    open`/`npx cypress run`); a runnable GitHub Actions snippet using the official `cypress-io/github-action`
    with `actions/upload-artifact` uploading `cypress/screenshots` and `cypress/videos`.
  - [x] Task 2.6. `== Comparison` section with a `[cols="1,3,3,3", options=\"header\"]` table (or equivalent),
    rows at minimum for: browser/engine coverage (Selenium broadest real-browser + legacy support vs. Playwright
    Chromium/Firefox/WebKit vs. Cypress Chromium-family-first with limited/experimental WebKit and Firefox),
    language support (Selenium/Playwright multi-language vs. Cypress JS/TS-only), execution
    model/speed/flakiness (Cypress in-browser vs. Playwright/Selenium out-of-process; auto-waiting behavior),
    built-in evidence/debugging tooling (Playwright Trace Viewer & UI Mode, Cypress Time-Travel debugger + video,
    Selenium's comparatively manual tooling), multi-tab/multi-origin support (a known historical Cypress
    limitation vs. Playwright/Selenium), parallelization/Grid story, and ecosystem maturity/community size.
    Follow the table with a short prose paragraph giving a general recommendation for new projects while noting
    when each tool's strengths still make it the right call (e.g. Selenium for cross-legacy-browser or
    broad-language requirements, or existing Selenium Grid infrastructure).
  - [x] Task 2.7. `== Other Options` section with a short subsection (a few lines each, not full treatments) for:
    **Puppeteer** (Google-maintained, Chromium/Chrome DevTools Protocol only, often the base other tools build
    on), **WebdriverIO** (WebDriver-protocol-based like Selenium but a more modern JS-first DX, can also drive
    via Puppeteer/CDP), **TestCafe** (no WebDriver/browser plugin required, proxy-based), and **Robot Framework**
    with the **Browser library** (keyword-driven, Playwright-powered under the hood — a non-code/low-code
    alternative for cross-language teams).

### Group 2 — Navigation, index, and cross-references

Parallelizable: yes (six independent files — `nav.adoc`, `web/index.adoc`, and four separate framework testing
pages — none overlap). Depends on Group 1 (the new page must exist at its final path/title before other pages
link to it and before it's added to the nav).

- [x] Task 3. Add the nav entry in `modules/ROOT/nav.adoc`, as a new `***` line immediately after
  `*** xref:web/accessibility.adoc[Web Accessibility]` (line 240) and before
  `*** xref:web/html-css/index.adoc[HTML & CSS Reference]` (line 241):
  `*** xref:web/e2e-testing-real-browsers.adoc[E2E Testing in Real Browsers]`.
- [x] Task 4. Add a bullet to the `== Sections` list in `modules/ROOT/pages/web/index.adoc`, immediately after
  the existing Accessibility bullet, matching its style: `xref:web/e2e-testing-real-browsers.adoc[E2E Testing in
  Real Browsers] -- ` followed by a one-line summary (Selenium, Playwright, and Cypress compared: installation,
  headless vs. headed execution, evidence capture, and CI/CD with GitHub Actions).
- [x] Task 5. In `modules/ROOT/pages/web/react/testing.adoc`, add a one-line cross-reference near the existing
  `== End-to-end tests` section (~line 160) pointing to `xref:web/e2e-testing-real-browsers.adoc[]` for the
  deeper tool-focused reference (install, headless/headed, evidence capture, CI/CD, and the Selenium/Playwright/
  Cypress comparison), without removing or rewriting the page's own existing Playwright/Cypress examples.
- [x] Task 6. In `modules/ROOT/pages/web/vue/testing.adoc`, add the equivalent one-line cross-reference near the
  existing `== End-to-end with Cypress or Playwright` section (line 194), same rationale as Task 5.
- [x] Task 7. In `modules/ROOT/pages/web/vaadin/testing.adoc`, add the equivalent one-line cross-reference near
  the existing `== Playwright and Selenium` section (line 75), same rationale as Task 5.
- [x] Task 8. In `modules/ROOT/pages/web/angular/testing.adoc`, add a short new subsection (e.g. `== End-to-end
  Testing`) since this page currently has no e2e content at all, with 1-2 sentences noting Angular apps are
  commonly e2e-tested with Playwright or Cypress like any other web app, plus the cross-reference to
  `xref:web/e2e-testing-real-browsers.adoc[]` for the full tool-focused reference.

### Group 3 — Build verification

Parallelizable: yes (single task).

- [x] Task 9. Verify the Antora site builds cleanly with the new page/nav/xref changes. Delegate this to a
  sub-agent so build output doesn't consume the main context window:
  `Agent({description: "Build and verify Antora docs", subagent_type: "iru-gate-runner", prompt: "Invoke
  Skill({skill: \"iru-build-docs\"}) to build this repository's Antora site (npx antora antora-playbook.yml,
  after the repo's own Mermaid-diagram validation step per .github/workflows/publish.yml) and report back
  whether it completed with no xref/AsciiDoc errors and no Mermaid validation errors. If it fails, report the
  exact error output so it can be fixed."})`.
  - [x] Task 9.1. If the build reports any `xref`/AsciiDoc error (e.g. a broken cross-reference from Group 2, a
    malformed table/admonition from Group 1) or a Mermaid validation error, fix the specific file(s) named in the
    error and re-run verification until clean.
