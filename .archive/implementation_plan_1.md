# Implementation Plan: Configure Google Analytics with Antora

## Task summary

Issue [#1](https://github.com/albertoirurueta/docs/issues/1) ("Configurar Google Analytics con Antora") asks to
wire up Google Analytics for the published site, giving a concrete gtag ID (`G-RDDFMQ8ENP`) and a reference
`gtag.js` snippet, and pointing at Antora's own `playbook/site-keys` and `playbook/configure-site` docs.

Exploration found the custom `ui-bundle.zip` already implements Antora's stock site-keys convention:
`partials/head-scripts.hbs` contains a `{{#with site.keys.googleAnalytics}}` block that emits exactly the
`gtag.js` snippet from the issue. Antora exposes a playbook key written as `google_analytics` (snake_case) or
`google-analytics` (kebab-case) under `site.keys` to templates as the camelCase `site.keys.googleAnalytics` —
confirmed against Antora's own `playbook/site-keys` documentation. No UI/template changes are needed: this is a
playbook configuration change only.

Cookiebot/consent-management (mentioned in the issue as "may be of interest") is not requested — out of scope
for this plan.

This is a YAML config-only change; no language/framework key applies (no matching `*-code-one-task` skill is
relevant).

## Current code state

- `antora-playbook.yml` (repo root) defines the `site:` block (`title`, `start_page`) but has no `keys:` sub-key
  today.
- `ui-bundle.zip`'s `partials/head-scripts.hbs` already reads `site.keys.googleAnalytics` and renders the
  `gtag.js` async script tag plus the inline `gtag('config', ...)` call — no changes needed there.
- The build is verified only by running `npx antora antora-playbook.yml` (or `--fetch`) and checking the
  generated `build/site` output; there is no lint/test suite (per `CLAUDE.md`).

## Implementation steps

1. [x] **Add the Google Analytics site key to `antora-playbook.yml`**
   - Added `keys: { google_analytics: 'G-RDDFMQ8ENP' }` under the `site:` block in `antora-playbook.yml`. No
     tests/coverage applicable (YAML config-only change, no test suite in this repo). No code-quality tooling
     applicable.
   - Add a `keys:` map under the existing `site:` block, setting `google_analytics: 'G-RDDFMQ8ENP'` (quoted, per
     Antora's own documented convention):
     ```yaml
     site:
       title: Irurueta Docs
       start_page: irurueta::index.adoc
       keys:
         google_analytics: 'G-RDDFMQ8ENP'
     ```
   - Do not touch `ui-bundle.zip` or any `modules/` content — the template support already exists.

2. [x] **Build the site locally and verify the tag is emitted**
   - Ran `npx antora antora-playbook.yml`; build completed with no `xref`/AsciiDoc errors.
   - Confirmed via grep that generated pages (e.g. `build/site/irurueta-navigation/1.8.1/index.html`) contain the
     `gtag.js` async script tag and `gtag('config','G-RDDFMQ8ENP')` call inside `<head>`. No tests/coverage
     applicable (no test suite in this repo).
   - Run `npx antora antora-playbook.yml` from the repo root.
   - Confirm the build completes without `xref`/AsciiDoc errors (consistent with this repo's only existing
     verification method).
   - Grep the generated output for the tag, e.g.:
     ```bash
     grep -R "G-RDDFMQ8ENP" build/site --include="*.html" -l | head -1
     ```
     Confirm at least one generated page contains the `gtag.js` script tag and the
     `gtag('config','G-RDDFMQ8ENP')` call, and that it appears in the `<head>` (i.e. before `</head>` in the
     matched file).
   - This is a single quick local build/grep, not a test suite — no need to delegate to a sub-agent.
