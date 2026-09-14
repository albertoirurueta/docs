# Implementation Plan — Code Distribution documentation (issue #133)

## Task summary

Source: GitHub issue #133
Base branch: main

Add "Code Distribution" documentation to the Programming Languages reference: for each language that already has
a build/packaging page, extend it with the missing pieces needed to actually **publish** an open-source library —
registry account setup, credential/token generation, manual CLI publish steps, and a GitHub Actions CI workflow
that automates publishing on a tagged release. The issue's own exploration already mapped per-language gaps (see
table in the issue body); this plan turns that table into concrete, file-level edits.

Scope decisions made while planning (none required asking the user — the issue's own body already resolves them):

- **Extend existing pages, don't create new ones**, for every language — including Python. The issue allowed
  splitting Python into a new `python/packaging-and-publishing.adoc` page "if the addition would otherwise
  overload the existing page," but the issue's own stated default is to prefer extending existing pages, and the
  JavaScript page (`tooling-bundling-npm-publishing.adoc`, 362 lines) already sets a precedent for a single page
  comfortably covering both build tooling and full npm publish mechanics (account, tokens, CI). Python's page is
  currently only 159 lines; adding the same category of content keeps it well within that same precedent size
  and avoids extra nav/index wiring (`nav-python.adoc`, `index.adoc`) for no real readability gain.
- **C / C++ stay out of scope**, per the issue's own recommendation — there is no equivalent self-service
  "publish my library" registry for C/C++, so no task is included for it.
- **Kotlin and Objective-C get short cross-reference sections**, not duplicated content — Kotlin links to Java's
  `=== Publishing to Maven Central` section (JVM/Maven Central publishing is identical for both), and
  Objective-C's new publishing section links to Swift's SPM-registry coverage while adding the
  Objective-C-specific CocoaPods (`pod trunk push`) path, which Swift's page doesn't cover.
- **GitHub Actions YAML style**: the C# page (`csharp/build-and-tooling.adoc`, `== Continuous Integration`,
  line 372) is the only page in the set with an existing, working GH Actions publish example. Every new YAML
  snippet added by this plan follows its conventions: job name `build`, `on: push`/`pull_request` triggers, a
  publish step gated with `if: startsWith(github.ref, 'refs/tags/v')`, and secrets interpolated via
  `${{ secrets.X }}`.
- **Trusted Publishing (OIDC) is presented as the primary/recommended CI approach** wherever the registry
  supports it (npm, PyPI, NuGet), with a token/secret-based fallback noted for registries or setups that still
  need one (Java/Maven Central via `central-publishing-maven-plugin` still requires a GPG key + Central Portal
  token as repository secrets — there is no OIDC path for Maven Central as of this writing).

No task in this plan has a matching installed `*-code-one-task` skill (only `java`, `dotnet`, `database`, and
`java-springboot` are installed) — this is pure AsciiDoc documentation authoring, not application code, so all
tasks are left untagged and will be implemented directly by `iru-code-one-task-group`.

## Current code state

All target files live under `modules/ROOT/pages/programming-languages/<language>/` in this Antora component
(`irurueta`, nav at `modules/ROOT/nav.adoc`, per-language nav partials at `modules/ROOT/partials/nav-<language>.adoc`).

| Language | File | Lines | Existing publish coverage | Existing GH Actions example |
|---|---|---|---|---|
| Java | `java/build-and-tooling.adoc` | 715 | `=== Publishing to Maven Central` (line 533–571): `central-publishing-maven-plugin` (Maven) / `com.vanniktech.maven.publish` (Gradle) config only | None on this page |
| Kotlin | `kotlin/build-and-tooling.adoc` | 126 | None at all | None |
| JavaScript/TS | `javascript/tooling-bundling-npm-publishing.adoc` | 362 | `== Publishing an Open-Source Library to npm` (line 154) through `=== Automating Releases` (349, EOF) — full `package.json`/dual-format/semver/`npm login`+`npm publish` coverage, but explicitly declines to give a CI example ("project-specific configuration rather than a fixed recipe") | None |
| C# | `csharp/build-and-tooling.adoc` | 471 | `=== Testing, Publishing and Packing` (66) for `dotnet pack`/`dotnet nuget push`; `== Continuous Integration` (372) has a full tag-gated GH Actions job already publishing to NuGet | Yes — see snippet below, this is the style reference |
| Swift | `swift/swift-package-manager.adoc` | 192 | One paragraph inside `== Building, Running, Testing and Publishing` (115), at line 148–152: publishing = tagging a Git commit; registry publish via `swift package-registry publish` mentioned in passing | None |
| Objective-C | `objective-c/build-and-tooling.adoc` | 323 | `== Dependency Managers` (219–273) covers SPM/CocoaPods/Carthage strictly as **consumers**, not publishing | None |
| Python | `python/virtual-environments-and-packaging.adoc` | 159 | `== PyPI and pyproject.toml` (124–153): intro to PyPI and the `[build-system]` table only; explicitly stops ("a topic ... this page does not go into further") | None |

Reference GH Actions YAML (C#, `csharp/build-and-tooling.adoc:372-417`) — the style every new snippet below follows:

```yaml
name: build
on:
  push:
    branches: [ main ]
  pull_request:
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '10.0.x'
      # ...build/test steps...
      - name: Pack
        if: startsWith(github.ref, 'refs/tags/v')
        run: dotnet pack -c Release --no-build -o artifacts
      - name: Publish to NuGet
        if: startsWith(github.ref, 'refs/tags/v')
        run: dotnet nuget push artifacts/*.nupkg -s https://api.nuget.org/v3/index.json -k "${{ secrets.NUGET_API_KEY }}"
```

TypeScript pages (`typescript/project-references-and-build.adoc:244,282`, `typescript/declaration-files.adoc:223,242`)
already `xref:` the JS npm-publishing page — no TypeScript-side changes are needed; the new npm CI/account/token
content will simply be visible through those existing links.

`modules/ROOT/pages/programming-languages/index.adoc` links only to each language's `index.adoc`, not to
individual sub-pages, so it needs no changes since no new pages are being created.

`.archive/` was checked for precedent: no prior plan covers package-distribution content specifically.
`implementation_plan_74.md` (Java Javadoc page) and `implementation_plan_75.md` (Python Docstrings page) are the
closest precedent for "add substantial new content to an existing language reference," used here only as a style
reference for task granularity, not copied structurally since this plan extends existing pages rather than adding
new ones.

## Implementation steps

### Group 1 — Per-language documentation edits (Parallelizable: yes — every task edits a distinct file with no shared state; the two cross-reference tasks (Kotlin→Java, Objective-C→Swift) link to headings that already exist verbatim today, so they don't need Java's/Swift's edits to land first)

- [x] Task 1. Extend Java's Maven Central publishing coverage in `modules/ROOT/pages/programming-languages/java/build-and-tooling.adoc`
  - [x] Task 1.1. Within `=== Publishing to Maven Central` (currently line 533–571), after the existing plugin-config content, add a `==== Creating a Sonatype Central Portal Account` subsection: registering at https://central.sonatype.com, and namespace verification (DNS TXT record for a custom domain, or automatic verification via GitHub repository ownership for a `io.github.<user>` namespace).
  - [x] Task 1.2. Add `==== Generating a User Token` subsection: generating a Central Portal user token (Account → Generate User Token) and where it's consumed (`~/.m2/settings.xml` `<server>` credentials, or Gradle `gradle.properties`/env vars for `com.vanniktech.maven.publish`).
  - [x] Task 1.3. Add `==== Generating and Publishing a GPG Key` subsection: `gpg --gen-key`, exporting the secret key (`gpg --export-secret-keys`), and publishing the public key to a keyserver (`gpg --keyserver keyserver.ubuntu.com --send-keys <KEY_ID>`) — Central Portal requires the signing key be resolvable from a public keyserver.
  - [x] Task 1.4. Add `==== A GitHub Actions Release Workflow` subsection with a concrete `[source,yaml]` example, following the C# reference style (job `build`, tag-gated publish step via `if: startsWith(github.ref, 'refs/tags/v')`): checkout, `actions/setup-java@v4`, import the GPG key from a `GPG_PRIVATE_KEY` secret (`echo "${{ secrets.GPG_PRIVATE_KEY }}" | gpg --batch --import`), then `mvn -B deploy -Dcentral.token=${{ secrets.CENTRAL_TOKEN }}` (or the Gradle `publish` task equivalent) only on a version tag.
  - [x] Task 1.5. Update `=== Also worth knowing` (line 573) if any of its bullet points about Maven Central become redundant with the new subsections — trim rather than duplicate.

- [x] Task 2. Add a short Kotlin publishing cross-reference in `modules/ROOT/pages/programming-languages/kotlin/build-and-tooling.adoc`
  - [x] Task 2.1. Insert a new `== Publishing to Maven Central` section between `== A Pointer to Kotlin Multiplatform` (line 105) and `== See Also` (line 113): 1–2 short paragraphs stating that a Kotlin/JVM library publishes through the exact same Sonatype Central Portal flow as a Java library (same plugins — `central-publishing-maven-plugin` for Maven, `com.vanniktech.maven.publish` for Gradle — both of which already work unmodified with Kotlin sources), then `xref:programming-languages/java/build-and-tooling.adoc[]` (or with an explicit fragment if convenient, e.g. `xref:programming-languages/java/build-and-tooling.adoc#_publishing_to_maven_central[Publishing to Maven Central]`) for the full account/token/GPG/CI walkthrough rather than repeating it.
  - [x] Task 2.2. If Kotlin Multiplatform publishing has any genuinely KMP-specific wrinkle worth a one-line callout (e.g. publishing multiple platform artifacts under one coordinate), add a single NOTE admonition — keep it brief; this is explicitly a cross-reference, not a parallel walkthrough.

- [x] Task 3. Extend npm publishing coverage in `modules/ROOT/pages/programming-languages/javascript/tooling-bundling-npm-publishing.adoc`
  - [x] Task 3.1. After `=== npm login and npm publish` (line 302) and before `==== Scoped Packages and --access public` (325), OR as a new subsection after `=== Automating Releases` (349, currently EOF) — place it wherever flows best given the existing prose — add `=== Creating an npm Account and Organization`: signing up at npmjs.com, and creating a scoped org for a package published under `@scope/name`.
  - [x] Task 3.2. Add `=== Generating an Access Token`: `npm token create` (or the npmjs.com web UI), the difference between a classic automation token and a fine-grained "Granular Access Token" scoped to specific packages/permissions, and where CI consumes it (`NODE_AUTH_TOKEN` env var / `.npmrc` `//registry.npmjs.org/:_authToken=`).
  - [x] Task 3.3. Add `=== npm Trusted Publishing (OIDC)`: npm's provenance/Trusted Publishing flow (no stored long-lived token — the npm registry trusts a GitHub Actions OIDC token tied to a specific workflow file/repo, configured on npmjs.com under the package's Publishing Access settings), presented as the recommended approach over Task 3.2's token for repos that can use it.
  - [x] Task 3.4. Replace the current "worth treating as project-specific configuration" hand-wave in `=== Automating Releases` (line 349–362) with a concrete `[source,yaml]` GitHub Actions example, C#-style: job `build`, tag-gated `npm publish` step, using OIDC (`permissions: id-token: write`, no `NODE_AUTH_TOKEN` needed) as the primary example, with a one-line note on substituting `NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}` for registries/setups without Trusted Publishing support.

- [x] Task 4. Extend NuGet publishing coverage in `modules/ROOT/pages/programming-languages/csharp/build-and-tooling.adoc`
  - [x] Task 4.1. Within or immediately after `=== Testing, Publishing and Packing` (line 66–86), add package-metadata guidance: the `<PropertyGroup>` MSBuild properties a publishable package needs (`PackageId`, `Authors`, `Description`, `PackageLicenseExpression`, `PackageReadmeFile`, `PackageIcon`, `RepositoryUrl`) with a short `.csproj` snippet.
  - [x] Task 4.2. Add a `=== Publishing to NuGet.org` subsection (placed after Task 4.1's content, before `=== Global and Local Tools` at line 87): creating a nuget.org account/organization, and generating a scoped API key (Account Settings → API Keys, scoped to a glob pattern like `MyLib.*`).
  - [x] Task 4.3. Within that same subsection, add a `NuGet Trusted Publishing (OIDC)` callout: NuGet.org's Trusted Publishing (GitHub Actions OIDC-based, no stored `NUGET_API_KEY` secret) as the modern alternative, noted as a drop-in replacement for the `dotnet nuget push -k` step already shown in `== Continuous Integration` (line 414–416) — update that existing YAML snippet in place to show both: the existing secret-based `-k "${{ secrets.NUGET_API_KEY }}"` step kept as the documented fallback, plus a short note on the OIDC alternative (no full duplicate workflow needed here, since a working one already exists on this page).

- [x] Task 5. Expand Swift publishing coverage in `modules/ROOT/pages/programming-languages/swift/swift-package-manager.adoc`
  - [x] Task 5.1. Promote the existing one-paragraph "Publishing" content (line 148–152, inside `== Building, Running, Testing and Publishing`) into its own `=== Publishing` subsection, keeping the existing Git-tag/`swift package-registry publish` content as its opening.
  - [x] Task 5.2. Add detail under that subsection: for the common public case (GitHub-hosted package resolved via `from:`/`upToNextMajor`), no registry account is needed at all — a semver Git tag is sufficient. For a private/corporate Swift package registry, publishing does require an account and an auth token (`swift package-registry login <url> --token <TOKEN>`).
  - [x] Task 5.3. Add a `[source,yaml]` GitHub Actions example, C#-style: job `build`, triggered on a version tag push, running `swift build` and `swift test` to validate the package, then using `softprops/action-gh-release` (or equivalent) to draft a GitHub Release from the tag — no secrets needed for the common Git-hosted case.
  - [x] Task 5.4. Add a one-line cross-reference to Objective-C's CocoaPods coverage (Task 6) for Objective-C libraries specifically, e.g. "For an Objective-C library, see also `xref:programming-languages/objective-c/build-and-tooling.adoc[]` for publishing via CocoaPods."

- [x] Task 6. Add a publishing section to `modules/ROOT/pages/programming-languages/objective-c/build-and-tooling.adoc`
  - [x] Task 6.1. Add a new `== Publishing a Library` section after `== Dependency Managers` (which ends at line 273) and before `== clang-format` (274) — Dependency Managers stays scoped to consuming dependencies, per current content.
  - [x] Task 6.2. Cover CocoaPods publishing: creating a CocoaPods Trunk account (`pod trunk register <email> '<name>'`), writing a `.podspec` (minimal example: `name`, `version`, `source`, `source_files`, `platform`), validating it (`pod spec lint`), and publishing (`pod trunk push`).
  - [x] Task 6.3. Add a short cross-reference to Swift's `=== Publishing` subsection (Task 5) for the SPM-registry angle, since an Objective-C target can also be distributed via a Swift package, e.g. `xref:programming-languages/swift/swift-package-manager.adoc[]`.
  - [x] Task 6.4. Add a `[source,yaml]` GitHub Actions example, C#-style: job `build`, tag-gated `pod trunk push` step, authenticated via a `COCOAPODS_TRUNK_TOKEN` secret (`pod trunk push --allow-warnings` reading the token from `~/.netrc` or `COCOAPODS_TRUNK_TOKEN` env var, per CocoaPods' own CI docs).

- [x] Task 7. Extend PyPI publishing coverage in `modules/ROOT/pages/programming-languages/python/virtual-environments-and-packaging.adoc`
  - [x] Task 7.1. Within `== PyPI and pyproject.toml` (line 124–153), after the existing `[build-system]` explanation, add `=== Building Distributions`: `python -m build` producing an sdist and a wheel into `dist/`, briefly naming `setuptools`/`hatchling`/`poetry-core` as interchangeable backends (the page already names `setuptools` as its example).
  - [x] Task 7.2. Add `=== Creating PyPI and TestPyPI Accounts`: registering at pypi.org and the separate test.pypi.org instance (used for dry-run publishes), and enabling 2FA (required by PyPI for publishing).
  - [x] Task 7.3. Add `=== Generating an API Token`: creating a scoped API token (Account Settings → API tokens, scoped to a single project after its first manual upload) and using it with `twine` (`TWINE_USERNAME=__token__`, `TWINE_PASSWORD=<token>`).
  - [x] Task 7.4. Add `=== Publishing with twine`: `twine upload --repository testpypi dist/*` against TestPyPI first, then `twine upload dist/*` for the real release.
  - [x] Task 7.5. Add `=== PyPI Trusted Publishing (OIDC)` as the recommended CI approach: configuring a Trusted Publisher on pypi.org (tied to a specific GitHub repo/workflow filename/environment), then a `[source,yaml]` GitHub Actions example, C#-style: job `build`, tag-gated, `permissions: id-token: write`, using `pypa/gh-action-pypi-publish` with no stored token at all.

### Group 2 — Build verification (Parallelizable: yes — trivially, a single task; depends on every Group 1 task having landed since it validates the whole set together)

- [x] Task 8. Verify the Antora build
  - [x] Task 8.1. Run `npx antora antora-playbook.yml` (or `npx antora --fetch antora-playbook.yml` if remote sources need refreshing) and confirm it completes with no `xref`/AsciiDoc errors — in particular, verify every new `xref:` added in Tasks 2, 5, 6 resolves (Kotlin→Java, Swift→Objective-C, Objective-C→Swift), and that every new `[source,yaml]`/`[source,bash]`/`[source,ruby]` block renders without AsciiDoc syntax errors (unclosed blocks, bad attribute lists).
  - [x] Task 8.2. Delegate this to a sub-agent so build output doesn't consume the main context window, e.g.:
    ```
    Agent({
      description: "Verify Antora build for issue 133 docs changes",
      subagent_type: "iru-gate-runner",
      prompt: "Run `npx antora antora-playbook.yml` in /Users/airurueta/repositories/docs2 and report back only: whether it succeeded, and the full text of any xref/AsciiDoc error or warning (with file:line) if it did not."
    })
    ```
  - [x] Task 8.3. If any error surfaces, fix the offending file directly (most likely causes: a mistyped `xref:` target path, or an unbalanced `[source,...]`/`----` fence) and re-run verification. (No error surfaced on this run — build succeeded cleanly.)
