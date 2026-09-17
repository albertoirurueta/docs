# Implementation Plan

## Task summary

Issue #148 reports that on the page "Authentication Methods: Passwordless & 2FA" (OAuth section), in the "Two
axes, one rule" section, the `image::oauth-authentication-factors.svg[...]` AsciiDoc block macro is displayed as
raw literal text instead of rendering as an image.

Root cause: in `modules/ROOT/pages/backend/oauth/authentication-methods-2fa-and-passwordless.adoc`, the
`image::` line has no blank line separating it from the preceding paragraph, so Asciidoctor treats it as a
continuation of that paragraph's text rather than as its own block-level macro. Every other `image::` usage in
this repository (checked across 9+ pages, e.g. `database/prometheus/alertmanager.adoc`) has a blank line before
it, and the archived plan for the original page (`.archive/implementation_plan_129.md`) confirms the intended
convention is `image::<name>.svg[<alt text>,width=700,role=text-center]` as its own block. The referenced SVG
(`modules/ROOT/images/oauth-authentication-factors.svg`) exists and needs no change — this is purely a missing
blank-line fix.

The fix is unambiguous, so no questions were raised — proceeding directly with the blank-line correction,
matching this repository's established `image::` block-macro convention.

Source: GitHub issue #148
Base branch: main

## Current code state

- `modules/ROOT/pages/backend/oauth/authentication-methods-2fa-and-passwordless.adoc` — AsciiDoc page, part of
  this repo's own Antora `ROOT` component (`antora.yml`).
  - Line 65 ends the paragraph: "...Only rows 3 and 4 are passwordless, because in both the primary factor
    itself is not a password."
  - Line 66 (immediately following, no blank line): the `image::oauth-authentication-factors.svg[...]` macro —
    currently merged into the preceding paragraph's text instead of being recognized as a block.
  - Line 67 (immediately following the image line): `== Passwords as the baseline primary factor` — a blank
    line already separated the image macro from this heading, so only the missing blank line *before* the
    macro needs fixing.
  - The image target `modules/ROOT/images/oauth-authentication-factors.svg` exists and is correctly named —
    no change needed there.
- No other file, nav entry, or image reference is affected — this is a single-page, single-line content fix.

## Implementation steps

### Group 1 — Fix the missing blank lines around the image macro (Parallelizable: yes — single task)

- [x] Task 1. Insert blank lines around the `image::oauth-authentication-factors.svg[...]` macro in
      `modules/ROOT/pages/backend/oauth/authentication-methods-2fa-and-passwordless.adoc`
  - [x] Task 1.1. Add a blank line between the end of the paragraph ("...is not a password.") and the
        `image::oauth-authentication-factors.svg[...]` line, so the macro becomes its own AsciiDoc block
        (matching the convention used by every other `image::` usage in this repository, e.g.
        `modules/ROOT/pages/database/prometheus/alertmanager.adoc`). A blank line already followed the macro,
        before the `== Passwords as the baseline primary factor` heading, so only this one line was missing.
        Do not change the macro's target, alt text, or attributes (`width=700,role=text-center`) — only the
        blank line before it.
  - [x] Task 1.2. Verify the fix by building the site and confirming the section renders as an image, not as
        literal text. Delegate this to the `iru-build-docs` skill (invoked directly in-context is fine here —
        it's a single, fast Antora build with plain text output, not a large test suite — but if an
        `iru-gate-runner`-style agent is preferred to keep output out of the main context, that's equally
        valid): run `npx antora antora-playbook.yml` (or `Skill({skill: "iru-build-docs"})`) and confirm the
        build completes without `xref`/AsciiDoc errors, then spot-check the rendered
        `build/site/.../authentication-methods-2fa-and-passwordless.html` output for the "Two axes, one rule"
        section to confirm the diagram now renders as an `<img>`/`<svg>` element instead of showing the raw
        `image::...[]` text.
