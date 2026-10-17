# Implementation Plan: Guides & References — "JVM Build automation tools and dependency management (Ant, Maven and Gradle)" (Programming Languages)

## Task summary

Source: GitHub issue #300
Base branch: main

Issue [#300](https://github.com/albertoirurueta/docs/issues/300) adds an Antora section
`modules/ROOT/pages/programming-languages/jvm-build-tools/` (nav title **JVM Build automation tools and dependency
management (Ant, Maven and Gradle)**): a detailed, learning-oriented reference for **Apache Ant 1.10.18** (with **Ivy 2.6.0** and
the **Maven Resolver Ant Tasks 2.0.0**), **Apache Maven 3.10.0** (3.9.16 also covered, **Maven 4.0.0-rc-7** as "release
candidate"), and **Gradle 9.8.1** (8.14.x also covered; Kotlin DSL primary, Groovy DSL alongside). **135 pages**: 10 shared
(incl. `index.adoc`, `ecosystem-and-learning-resources.adoc`, `cheat-sheet.adoc`), 36 under `ant/`, 44 under `maven/`, 45 under
`gradle/`; a disclaimer partial, a nav partial, original `jvm-build-tools-*.svg` figures plus Mermaid diagrams, a one-page A4
PDF `modules/ROOT/attachments/jvm-build-tools-cheat-sheet.pdf`, landing-page edits, five back-links and a bibliography.

**The binding spec** is the issue body plus four comments (split only for GitHub's size limit): shared pages + Ant outline
(issuecomment-6171352190), Maven outline (-6171352852), Gradle outline (-6171353435), books tables (-6171353974). Local copies in
the session scratchpad: `issue300.md` (body) and `issue300_comments.md` (all comments); re-fetch with
`gh issue view 300 --json body,comments` if missing. **Every page task must re-read its own outline bullets** (★ depth, 📊
figures, source anchors, "book outdated" notes, release-history tables) from there. The running scenario is the original
*tidepool* project built with all three tools (defined at the top of the first comment).

### Choices made on the user's behalf

1. **Branch `feature/300`, one draft PR to `main`** with `Closes #300` (user-confirmed base `main`). The issue's optional
   eight-PR split on `feature/300-jvm-build-tools` is not used (same decision as #297/#299); the groups below follow its eight
   slices so the work could still be cut.
2. **Tasks are untagged.** Installed keys (`java`, `java-springboot`, `dotnet`, `database`) don't fit AsciiDoc/Mermaid/SVG/PDF
   authoring, so tasks are implemented directly. Build examples are **run for real** in scratch directories (never committed).
3. **Tooling is missing and must be fetched with the user's approval** (Task 1): Ant 1.10.18, Gradle (via the 9.8.1 wrapper), Maven
   3.10.0 and Maven 4.0.0-rc-7 (or GA) are downloaded from the official sites into the scratchpad, **asking the user before each
   download** (file, source, size). No `brew`/`sdk`/`pdfinfo`; PDF page count via `mdls -name kMDItemNumberOfPages`. Installed:
   JDK 26 (the issue assumed 25; the JDK actually used is stated on each page), Maven 3.9.16, Node 24. If a tool cannot be
   obtained, its examples are labelled "not run here" and checked line by line against the docs.
4. **Books are not available locally** (`~/Desktop/libros/ant-maven-gradle/`); they are cited only on the landing-page
   bibliography (publisher pages) and in "book is outdated" prose taken from the issue's tables. No book text/listing/figure is
   reproduced.
5. **Version baseline is re-verified at implementation time and dated** (Task 1.2): Maven 4.0.0 GA, Gradle 9.9, Ant 1.10.19 may
   have landed. If Maven 4 is GA, update the baseline and drop the "release candidate" label.
6. **Existing pages get real `xref:`s** (verified with `ls`); issues #196, #236, #297, #299 are mentioned in prose only
   (note: `programming-languages/groovy/*` and `scala/*` now exist on `main`, so those may be `xref:`-linked where useful).
7. **Disclaimer** `jvm-build-tools-disclaimer.adoc` shaped exactly like `rust-disclaimer.adoc`/`scala-disclaimer.adoc`; it is the
   **only** admonition in the section (no `NOTE`/`TIP`/`WARNING`/`CAUTION`/`IMPORTANT` anywhere else).
8. **Mermaid/SVG floor:** every 📊 in the outline is delivered; SVGs are original (no Ant/Maven/Gradle/Develocity/Apache logos,
   no doc or book figures).

### Mandatory conventions for every page task (from the issue and `CLAUDE.md`)

- Header: `= Title`, `:description:`, `:keywords:`, then `include::partial$jvm-build-tools-disclaimer.adoc[]`; intro states the
  release the page was written against and the JDK used; features newer than Maven 3.9 / Gradle 8.14 name their release and say
  incubating/experimental/preview/deprecated in prose; Maven 4 features say "Maven 4 (release candidate)".
- Each concept: what/why with design rationale, every relevant element/attribute/task/goal/phase/property/CLI option/env var,
  the equivalent in the other two tools (sentence or small table, linked), real error messages, classic bugs, release in which a
  feature appeared/changed/was removed, extra JARs/plugins needed and how to add them, where the books are outdated.
- Each example: complete and runnable on the baseline releases, with **real output** (`[source,text]` produced by running it, or
  a self-checking test; never invented), followed by `Source: https://…[…]` to the official page/anchor (looked up, never
  guessed). Gradle examples that differ by DSL: Kotlin first (`.Kotlin DSL`), then Groovy (`.Groovy DSL`). Publishing only to
  `file://…/build/repo` or `localhost`; no real secrets/hosts/keys (placeholders such as `${env.CENTRAL_TOKEN}`).
- Each page ends with `== References` (official online docs only, plus book publisher pages where consulted).
- AsciiDoc pitfalls (`CLAUDE.md`): inline code containing `${…}`, `@{…}`, `*`/`**`, `~`, `^`, `->`, `=>`, `<-`, `'` between letters, `#`,
  `__`, `...` uses `` `+…+` ``; containing `+` uses `` `pass:c[…]` `` (`]` as `\]`); `|` in table cells escaped `\|`. Image macros on
  one line, block macros at column 0, alt text containing a comma wrapped in double quotes.
- Mermaid: `<` directly followed by a letter/`/`/`!`/`?` written as `&lt;` (XML element names, `&lt;&lt;interface&gt;&gt;`).
- Each task's own verification: run its examples; grep its files for unquoted-comma image alt text, unclosed block macros, and
  admonition blocks (only the disclaimer include may exist); check every `Source:` URL/anchor with `curl`.

## Current code state

- No application code. Site definition: `antora-playbook.yml`; component `ROOT` (`antora.yml`); nav `modules/ROOT/nav.adoc`
  (Programming Languages open block includes `nav-kotlin`, `nav-c`, `nav-cpp`, `nav-objective-c`, `nav-csharp`, `nav-swift`,
  `nav-php`, `nav-groovy`, `nav-scala`, then `--`; `nav-jvm-build-tools` is added after `nav-scala`).
- Templates: `modules/ROOT/partials/scala-disclaimer.adoc` / `groovy-disclaimer.adoc` / `rust-disclaimer.adoc`,
  `nav-scala.adoc` / `nav-groovy.adoc` / `nav-kotlin.adoc`; cheat-sheet pages `programming-languages/java/cheat-sheet.adoc`,
  `scala/cheat-sheet.adoc`; precedent plans `.archive/implementation_plan_299.md` (Scala, 96 pages) and
  `.archive/implementation_plan_297.md` (Groovy, 78 pages).
- `modules/ROOT/pages/programming-languages/index.adoc` has `:description:`/`:keywords:`, a "live only here" sentence and per-language
  bullets under `== Sections`. `modules/ROOT/attachments/` holds cheat-sheet PDFs; `modules/ROOT/images/` holds 728 SVGs.
  `scripts/validate-mermaid.mjs` backs `npm run validate:mermaid` (needs `npm i --no-save mermaid@11 jsdom`).
- `modules/ROOT/pages/programming-languages/jvm-build-tools/` does **not** exist yet; no `feature/300-*` branch exists.
- Back-link targets (all exist): `programming-languages/java/build-and-tooling.adoc` (`== See Also`),
  `programming-languages/kotlin/build-and-tooling.adoc` (`== See Also`), `backend/springboot/maven-quality-plugins.adoc` (end of
  intro), `apps/android/project-structure-and-gradle.adoc` (`== References`/new `== See Also`),
  `web/gwt/build-tools-maven-and-gradle.adoc` (end of intro). Other existing pages to link (not repeat): `apps/kotlin-multiplatform/*`,
  `apps/android/android-libraries-and-maven-central.adoc`, `apps/android/ci-cd-with-github-actions.adoc`,
  `backend/quarkus/build-tooling-and-languages.adoc`, `backend/jmeter/ci-cd-with-maven-docker-and-github-actions.adoc`,
  `backend/docker/java-and-spring-boot-images.adoc`, `web/jsp-struts/jsp/jasper-configuration-and-precompilation.adoc`,
  `backend/pdf-generation/jasperreports-large-reports-and-performance.adoc` (verify each with `ls` before linking).
- Tooling on this machine: JDK 26, Maven 3.9.16, Node 24.21, Antora, Chrome, `detect-secrets`. **Missing:** Ant, Gradle,
  Maven 3.10.0/4 RC, `brew`, `sdk`, `pdfinfo`.

## Implementation steps

### Group 1 — Tooling, baseline, shared partials (Parallelizable: no — Task 2 and every later group depend on Task 1's verified baseline)

- [x] Task 1. Prepare tooling and verify the baseline
  - [x] Task 1.1. Install the build tools into the scratchpad
    - Tools already downloaded with user approval (2026-10-16), checksums verified (sha512 Apache, sha256 Gradle), under
      `/private/tmp/claude-501/-Users-albertoirurueta-repositories-common-docs/e69ba267-8597-41a4-8cce-b8010360294b/scratchpad/tools/`:
      `apache-ant-1.10.18/bin/ant` (with `lib/ant-junitlauncher.jar`), `apache-maven-3.10.0/bin/mvn`,
      `apache-maven-4.0.0-rc-7/bin/mvn` (still RC on 2026-10-16), `gradle-9.8.1/bin/gradle` (use it to generate the 9.8.1 wrapper).
      JDKs: 26 (default, `/Library/Java/JavaVirtualMachines/jdk-26.jdk`), JBR 21.0.10 and JBR 17.0.14 under
      `~/Library/Java/JavaVirtualMachines/`. Remaining for this sub-task: version checks and the *tidepool* skeleton.
    - Original sub-task text: (**ask the user before each download**, stating filename/source/size, verify checksums): Ant 1.10.18 (+ `ant-junitlauncher`), Maven 3.10.0, Maven 4.0.0-rc-7 (or GA), Gradle 9.8.1 via a generated wrapper. Confirm `ant -version`, `mvn -v`, `./gradlew --version`, and record the JDK used (JDK 26 here; JDK 17 for Maven 4/mvnd where needed). Create a scratch *tidepool* skeleton (model/engine/cli + `data/stations.csv`) shared by later tasks.
  - [x] Task 1.2. Re-verify the version baseline tables (Ant/Ivy/Resolver Ant Tasks/antlibs, Maven 3.10/3.9/4 RC and plugin versions, Gradle 9.8.1/8.14.x) and curl-check every URL/anchor listed in the inventory and outline comments; record corrections in a scratchpad `jvm-build-tools-baseline-notes.md`.
    - Done: baseline confirmed unchanged (Maven 4 still 4.0.0-rc-7, Gradle 9.8.1, Ant 1.10.18); 682 URLs/anchors checked, details in the notes file.
  - [x] Task 1.3. Check that highlight.js in the UI bundle has grammars for `xml`, `kotlin`, `groovy`, `toml` (else use `ini`), `properties`, `java`, `bash`, `yaml`; check how many nav levels render well (four below Programming Languages); note the PDF page-count method (`mdls`).
    - Done: baseline notes in scratchpad `jvm-build-tools-baseline-notes.md`. highlight.js has all grammars except `toml` and `ini` (use `[source,text]` for the version catalog); nav renders 4 levels below Programming Languages (data-depth 0-6); PDF pages via `mdls`.
- [x] Task 2. Create the shared partials
  - Done: files `modules/ROOT/partials/jvm-build-tools-disclaimer.adoc`, `modules/ROOT/partials/nav-jvm-build-tools.adoc` (135 page xrefs, names match the outline), `modules/ROOT/nav.adoc` (include added). Build shows only the 135 expected unresolved-xref errors.
  - [x] Task 2.1. `modules/ROOT/partials/jvm-build-tools-disclaimer.adoc`: single `[IMPORTANT]` block shaped like `scala-disclaimer.adoc`, AI-assistance disclosure + `xref:programming-languages/jvm-build-tools/index.adoc#_bibliography[the section bibliography]`.
  - [x] Task 2.2. `modules/ROOT/partials/nav-jvm-build-tools.adoc`: relative-depth entries starting with `* xref:programming-languages/jvm-build-tools/index.adoc[JVM Build automation tools and dependency management (Ant, Maven and Gradle)]`, shared pages as `**`, then `** Apache Ant`/`** Apache Maven`/`** Gradle` (index xrefs) with non-link `***` groups and `****` children following the outline groups; last two entries `Ecosystem` and `Cheat Sheet (PDF)`. Flatten if four levels render badly. (Written from the outline file names; adjusted in Task 32 if any page is renamed.)
  - [x] Task 2.3. Add `include::partial$nav-jvm-build-tools.adoc[]` to `modules/ROOT/nav.adoc` after `include::partial$nav-scala.adoc[]`, inside the Programming Languages open block.

### Group 2 — Slice 1: shared foundation pages (Parallelizable: yes — distinct files; `index.adoc` and `cheat-sheet.adoc` are deferred to Groups 9–10)

- [x] Task 3. ★ `build-automation-fundamentals.adoc` (📊 SVG `jvm-build-tools-timeline.svg`, 📊 Mermaid graph comparing target graph / lifecycle / task graph)
- [x] Task 4. ★ `dependency-management-fundamentals.adoc` (coordinates, scopes vs configurations mapping table, conflict resolution, ranges, BOMs/platforms, module metadata; 📊 per outline)
- [x] Task 5. `repositories-and-publishing-across-tools.adoc`
- [x] Task 6. ★ `comparing-ant-maven-and-gradle.adoc` (equivalence table, choosing a tool)
- [x] Task 7. `migrating-between-tools.adoc`
- [x] Task 8. ★ `supply-chain-security.adoc` (wrappers, checksums, signatures, dependency verification, SBOMs, the 2026 CVEs)
- [x] Task 9. `ci-and-ide-integration.adoc`

### Group 3 — Slice 2: Ant core, install → packaging (Parallelizable: yes — distinct files)

- [x] Task 10. Ant fundamentals (`ant/`): `versions-and-release-history`, `installation`, `running-ant`, ★ `build-file-structure`, ★ `targets-and-extension-points`, ★ `properties` (`ant/index.adoc` deferred to Task 27)
- [x] Task 11. Ant data types: ★ `paths-filesets-and-patterns`, `selectors`, `resource-collections`, `filters-and-mappers`, `conditions-and-control-flow`
- [x] Task 12. Ant task categories: ★ `compiling-java`, ★ `packaging-archives`, `file-operations`, `running-programs`, ★ `testing-with-junit-and-junitlauncher`, `documentation-and-xml`, `network-and-remote-tasks`, `utility-tasks`

### Group 4 — Slice 3: Ant advanced, Ivy, Maven Resolver Ant Tasks (Parallelizable: yes — distinct files)

- [x] Task 13. Ant structuring and extension: ★ `multi-file-builds-import-include-and-subant`, `macros-and-presets`, `scripting`, `listeners-loggers-and-input-handlers`, ★ `writing-custom-tasks` (`<checkstations>`), `custom-types-conditions-and-selectors`, `antlibs-and-namespaces`, `embedding-ant`
- [x] Task 14. Ivy (6 pages): ★ `ivy-overview`, ★ `ivy-module-descriptors-and-configurations`, `ivy-settings-and-resolvers`, `ivy-conflicts-and-versions`, `ivy-ant-tasks`, `ivy-publishing-and-multi-project`
- [x] Task 15. ★ `ant/maven-resolver-ant-tasks.adoc` and `ant/deprecations-and-migration.adoc`

### Group 5 — Slice 4: Maven fundamentals, lifecycle, plugins, dependencies (Parallelizable: yes — distinct files; `maven/index.adoc` deferred to Task 27)

- [x] Task 16. Maven getting started: `versions-and-release-history`, ★ `philosophy-coordinates-and-directory-layout`, `installation`, `getting-started`, ★ `running-maven-cli`, `configuring-maven`
  - Done: all 6 pages under `maven/`; examples run on Maven 3.10.0 (primary) with 3.9.16 / 4.0.0-rc-7 differences where the outline asks; no new SVGs (outline asks none for the two pages written on the resumed run). Group-validated: scratch Antora build shows only xrefs to not-yet-written pages, CLAUDE.md greps clean, all Mermaid diagrams parse.
- [x] Task 17. POM, lifecycle, plugins: ★ `pom-fundamentals`, ★ `inheritance-aggregation-and-the-effective-pom`, ★ `build-lifecycle`, ★ `plugins-and-their-configuration`
  - Done: all 4 pages; Mermaid figures (model-builder flow, inheritance/aggregation graph) instead of SVGs; examples run on 3.10.0 / 3.9.16 / 4.0.0-rc-7. Group-validated as above.
- [x] Task 18. Maven dependency management: ★ `dependencies-scopes-and-mediation`, ★ `dependency-management-and-boms`, `versions-snapshots-and-ranges`, ★ `dependency-analysis-and-convergence`, `installing-third-party-jars-and-relocation`
  - Done: all 5 pages; Mermaid figures (mediation graph, management precedence, snapshot resolution); examples run on 3.10.0 / 3.9.16 / 4.0.0-rc-7, remote deploys/Central publishing labelled "not run here". Group-validated as above.

### Group 6 — Slice 5: Maven repositories, multi-module, build tasks, publishing, tooling, Maven 4 (Parallelizable: yes — distinct files)

- [x] Task 19. Repositories, settings, profiles, multi-module: ★ `repositories-mirrors-and-repository-managers`, ★ `settings-xml-and-password-encryption`, `profiles`, ★ `multi-module-builds-and-the-reactor`, `ci-friendly-versions`
  - Done: all 5 pages; SVGs `jvm-build-tools-maven-repositories.svg`, `jvm-build-tools-maven-settings-and-secrets.svg`, plus Mermaid figures; examples run on 3.10.0 / 3.9.16 / 4.0.0-rc-7 (localhost Python stand-in for hosted/proxy/group repos, file:// deploys, throwaway passwords); Nexus/Artifactory/Reposilite setup, `mvnenc init` wizard and some key sources labelled "not run here". Per-page verification clean (only xrefs to not-yet-written pages).
- [x] Task 20. Building, testing, packaging, releasing: `resources-and-filtering`, ★ `compiling-and-toolchains`, ★ `testing-with-surefire`, `integration-testing-with-failsafe`, `packaging-jars-wars-and-manifests`, ★ `uber-jars-with-shade-and-assembly`, `site-and-reporting`, `install-deploy-and-distribution-management`, `releasing`, ★ `publishing-to-maven-central` (publishing to Central labelled "not run here"), `archetypes`
  - Done: all 11 pages; SVGs `jvm-build-tools-maven-shade-vs-assembly.svg`, `jvm-build-tools-maven-site-pipeline.svg`, plus Mermaid figures; examples run on 3.10.0 / 3.9.16 / 4.0.0-rc-7 (file:// deploys, local bare git repo for releases, throwaway GPG key, localhost stand-ins for auth repo and Central Portal API). Actual Central upload/namespace setup, scp/sftp site deploy, GitHub Pages push, diffoscope, Jetty/Testcontainers labelled "not run here". Per-page verification clean (only xrefs to not-yet-written pages).
- [x] Task 21. Tooling, internals, Maven 4, practice: ★ `maven-wrapper`, `extensions`, `build-performance-cache-parallel-and-mvnd`, `maven-resolver`, `enforcer`, `security-and-reproducible-builds`, ★ `writing-plugins` (`tidepool:check-stations`), ★ `maven-4-whats-new`, `maven-4-pom-model-and-consumer-pom`, `maven-4-lifecycle`, ★ `migrating-to-maven-4`, `troubleshooting-and-best-practices`
  - Done: all 12 pages; SVGs `jvm-build-tools-maven-build-performance.svg`, `jvm-build-tools-maven-4-lifecycle.svg`, `jvm-build-tools-maven-4-concurrent-timeline.svg`, plus Mermaid figures; examples run on 3.10.0 / 3.9.16 / 4.0.0-rc-7 (Maven 4 pages on rc-7, `tidepool:check-stations` Mojo built and run, Build Cache Extension local cache, `mvnup` migration of a tidepool copy). mvnd, remote build cache, `mvnenc init`, OWASP Dependency-Check and repository managers labelled "not run here". Group 6 validated: scratch Antora build shows only xrefs to not-yet-written Gradle/index pages, CLAUDE.md greps clean, one admonition per page, no orphan/missing images, all 1910 Mermaid diagrams parse.

### Group 7 — Slice 6: Gradle fundamentals, build authoring, tasks, plugins (Parallelizable: yes — distinct files; `gradle/index.adoc` deferred to Task 27)

- [x] Task 22. Gradle fundamentals: `versions-compatibility-and-release-history`, ★ `core-concepts`, `installation`, ★ `gradle-wrapper`, ★ `command-line-interface`, ★ `build-environment-and-properties`, `gradle-daemon`, `directories-and-logging`
  - Done: all 8 pages (resumed run: 7 pre-existing, `build-environment-and-properties` finished from the earlier draft); examples on Gradle 9.8.1 wrapper, JDK 26, Kotlin and Groovy DSL, per-agent GRADLE_USER_HOME; official wrapper properties shown. Gradle 8.14, Plugin Portal and real remote publishing labelled "not run here".
- [x] Task 23. Build authoring, tasks, lazy model: ★ `build-lifecycle`, ★ `settings-and-build-scripts`, ★ `kotlin-dsl`, `groovy-dsl-and-migrating-to-kotlin`, ★ `tasks`, ★ `lazy-configuration-and-providers`, ★ `writing-custom-tasks`, ★ `incremental-build`, `working-with-files`, `worker-api-and-build-services`
  - Done: all 10 pages (`tasks`, `lazy-configuration-and-providers`, `writing-custom-tasks`, `incremental-build`, `working-with-files`, `worker-api-and-build-services` written in this run); Mermaid figures (task graph, up-to-date decision flow); every example run on 9.8.1 in both DSLs with `--configuration-cache`; 8.14 differences labelled "not run here".
- [x] Task 24. Plugins and structure: ★ `plugins-overview`, ★ `convention-plugins-and-sharing-build-logic`, `binary-plugins` (`tidepool.station-check`), `testing-and-publishing-plugins`, ★ `multi-project-builds`, `composite-builds`
  - Done: all 6 pages; `tidepool.station-check` binary plugin built, validated, published to a file:// repo with its marker and applied by a consumer; ProjectBuilder/TestKit tests run; `publishPlugins` to the Portal "not run here" (placeholder keys; `--validate-only` shown failing on missing keys). Group 7 validated: scratch Antora build of all 24 Gradle pages shows only xrefs to not-yet-written Gradle/index pages, CLAUDE.md greps and rendered inline-code check clean, one admonition per page, all 14 Mermaid diagrams parse.

### Group 8 — Slice 7: Gradle dependency management, JVM builds, publishing, performance, upkeep (Parallelizable: yes — distinct files)

- [x] Task 25. Gradle dependency management: ★ `declaring-dependencies-and-configurations`, `repositories-and-content-filtering`, ★ `version-catalogs`, ★ `platforms-constraints-and-rich-versions`, ★ `dependency-resolution-conflicts-and-capabilities`, `variant-aware-resolution-and-module-metadata`, `resolution-rules-and-substitution`, ★ `dependency-locking-verification-and-caching`
  - Done: all 8 pages; new SVG `jvm-build-tools-gradle-configurations.svg` (declaring-dependencies); Mermaid in version-catalogs, dependency-resolution (2), dependency-locking. Every example run on Gradle 9.8.1 wrapper, JDK 26, both DSLs, with `--configuration-cache` (intentional failures without it); publishing only to file:// repos, localhost HTTP repos for credentials/dynamic-version/cache demos, verification metadata bootstrapped with a fresh GRADLE_USER_HOME; libs.versions.toml as [source,text]. Gradle 8.14 differences labelled "not run here".
- [x] Task 26. JVM builds, performance, upkeep: ★ `java-projects`, ★ `toolchains`, ★ `testing-jvm-projects`, ★ `publishing`, ★ `build-cache`, ★ `configuration-cache-and-isolated-projects`, `performance-profiling-and-build-scans`, ★ `ant-integration`, ★ `migrating-from-maven`, `init-scripts-and-the-tooling-api`, ★ `upgrading-gradle`, `best-practices-and-troubleshooting`
  - Done: all 12 pages; Mermaid in java-projects (2), toolchains, publishing, build-cache, configuration-cache, performance-profiling, ant-integration (2), migrating-from-maven, upgrading-gradle, best-practices. Toolchains on JBR 21/17 with auto-download off (JDK download "not run here"); signing with a throwaway 1-day key in a scratch GNUPGHOME, publishing to file:// and a localhost stub; remote build cache against a localhost toy node; Build Scan publishing/terms "not run here"; Maven 3.10.0 and Ant 1.10.18 comparison runs; wrapper regenerated only at 9.8.1, real 8.14->9 upgrade "not run here". Group 8 validated: scratch Antora build shows only xrefs to the not-yet-written jvm-build-tools/index (bibliography) and gradle/index pages, CLAUDE.md greps and rendered inline-code check clean, one admonition per page, all 30 Gradle Mermaid diagrams parse.

### Group 9 — Landing pages, ecosystem page, tool indexes (Parallelizable: yes — distinct files; needs all page names final)

- [x] Task 27. Tool and section landing pages
  - [x] Task 26.1. `ant/index.adoc`, `maven/index.adoc`, `gradle/index.adoc` (tool overview, release baseline, reading path, grouped page list)
  - [x] Task 26.2. `jvm-build-tools/index.adoc`: tools table, release baseline, *tidepool* scenario, how the books were used, reading paths, 📊 Mermaid mind-map, `== What's covered`, and `== Bibliography` listing **every source** (Ant, Maven, Gradle, specs/standards, the three books via publisher pages, third-party projects), each linked to its official site
  - Done: tool indexes list every page per nav group (Ant 35, Maven 43, Gradle 44), reference links curl-checked; section index has tools table, baseline, tidepool, books via publisher pages, reading paths, Mermaid mind-map, What's covered (all pages) and `== Bibliography` (last section, id `_bibliography`, ~1147 entries collected from all 129 pages' Source/References lines, mirrors the Scala/Groovy index pages ending with Bibliography). No images/examples.
- [x] Task 28. `ecosystem-and-learning-resources.adoc` (other JVM build tools, third-party plugins, repository managers, CI, IDEs: brief entry + official links only)
  - Done: tables per area with status checked 2026-10-16 and curl-checked links. Amper is listed as "Kotlin Toolchain (formerly Amper)" (JetBrains/amper archived); Ant-Contrib linked via SourceForge (site 403s to curl); Packt book URL kept from the issue but 403s to curl (unverified).
  - Group 9 validation: scratch local-component Antora build rc=0, only jvm-build-tools xref errors are 4 to cheat-sheet.adoc (Group 10); CLAUDE.md greps clean; inline-code grep clean on the 5 pages; validate:mermaid 1941/1941 parsed.

### Group 10 — Cheat sheet, PDF, existing-page integration (Parallelizable: no — the cheat sheet xrefs every page, the PDF content depends on the finished section, and Task 32 finalises the nav)

- [x] Task 29. `cheat-sheet.adoc` (disclaimer, intro with release baseline and check date, grouped `*Group* --` paragraphs of `xref:`s to every page, download line, `== References`)
  - Done: `jvm-build-tools/cheat-sheet.adoc` with 27 grouped paragraphs xref-ing all 134 other pages (generated from the nav order), PDF download line, 10 curl-checked references (all 200).
- [x] Task 30. `modules/ROOT/attachments/jvm-build-tools-cheat-sheet.pdf`: one-page A4 (landscape allowed), colour-coded per tool, header "Ant 1.10.18 · Maven 3.10.0 (4.0 RC) · Gradle 9.8.1" + date; rendered from a throwaway HTML in the scratchpad with headless Chrome (`--headless --print-to-pdf --no-pdf-header-footer`); verify exactly one page with `mdls -name kMDItemNumberOfPages`, preview as PNG; only the PDF is committed
  - Done: one A4 landscape page (page-tree `/Count 1`; `mdls` returned null even after `mdimport`), three colour-coded columns (Ant red, Maven blue, Gradle green) plus a "same job, three tools" strip; rendered from scratchpad HTML with headless Chrome, PNG preview inspected; Ant/Maven/Gradle skeleton snippets run in `scratchpad/work/cheat-sheet` (Ant 1.10.18, Maven 3.10.0, Gradle 9.8.1: all successful).
- [x] Task 31. Landing-page and back-link edits
  - [x] Task 30.1. `programming-languages/index.adoc`: bullet in `== Sections`, `:description:`/`:keywords:` additions, "live only here" sentence
  - [x] Task 30.2. `modules/ROOT/pages/index.adoc`: add to `:description:`/`:keywords:` only if they list language references (no new tile)
  - [x] Task 30.3. One-line back-links in the five pages listed under *Current code state*
  - Done: section bullet, `:description:`/`:keywords:` and "live only here" sentence in `programming-languages/index.adoc`; root `index.adoc` keywords only (its description lists no languages); back-links in java/kotlin `build-and-tooling.adoc` (`== See Also`), `maven-quality-plugins.adoc` and GWT `build-tools-maven-and-gradle.adoc` (end of intro), Android `project-structure-and-gradle.adoc` (new `== See Also` before `== References`).
- [x] Task 32. Reconcile `nav-jvm-build-tools.adoc` with the final page list (every page present exactly once, correct order)
  - Done: 135 nav xrefs = 135 page files, no duplicates; renamed two nav titles to match page titles (`Supply-Chain Security`, `Ivy: Overview`); other nav titles keep the page title minus the tool prefix, as in the Scala/Groovy navs.
  - Group 10 validation: scratch local-component Antora build rc=0, zero local xref errors (all 71 are cross-component `::` xrefs to remote components absent from the scratch playbook); PDF in build output `_attachments/` and linked twice from `cheat-sheet.html`; CLAUDE.md image greps clean; inline-code grep clean on the cheat sheet and landing pages (pre-existing hits only in untouched lines of the back-link pages); node_modules/.package-lock.json unchanged.

### Group 11 — Verification, secrets baseline, archive prep (Parallelizable: no — sequential gates on the finished section)

- [x] Task 33. Build and verify
  - [x] Task 33.1. `npx antora antora-playbook.yml` completes with no xref/AsciiDoc errors or warnings; page count is 135 under `jvm-build-tools/` — real playbook built with exit 0 and zero log lines (no warnings/errors); 135 HTML pages in build/site/programming-languages/jvm-build-tools/.
  - [x] Task 33.2. Run the `CLAUDE.md` checks (quoted `--include` patterns) for `build/site/.../programming-languages/jvm-build-tools/`: block image macros closed, inline `image:` closed, no `<p>image::`, no substitutions inside inline `<code>`, no alt text with unquoted comma; every `jvm-build-tools-*.svg` is referenced and every `image::` target exists; no admonition other than the disclaimer — all greps empty; 19/19 SVGs referenced and present; each of 135 pages renders exactly one admonition (the IMPORTANT disclaimer partial).
  - [x] Task 33.3. `npm i --no-save mermaid@11 jsdom` then `npm run validate:mermaid` reports every diagram parsed — "All 1941 Mermaid diagrams parsed successfully" (86 in this section).
  - [x] Task 33.4. Check every `xref:` resolves and no `xref:` points to #196/#236/#297/#299 (prose only); curl-check all `Source:` URLs/anchors; check Maven Doxia/Gradle `:` anchors render as written; spot-check pages in the built site (nav under Programming Languages, PDF link, Gradle DSL pairs) — 3091 unique link URLs (1210 pages, incl. 2179 `Source:` URLs) curl/anchor-checked: all OK except Packt book URL (Cloudflare 403, kept from issue, unverifiable); 3849 internal hrefs/anchors resolve; 674 `:` anchors render as written; nav (135 entries under Programming Languages), PDF link and Kotlin-first DSL pairs OK. Fixed: 3 broken in-page anchors (explicit ids added), ~150 inline-code rendering defects (unclosed `+`, `$$` passthrough, `::` dlist, constrained backticks next to quotes/apostrophes, URLs autolinked inside code -> passthrough).
  - [x] Task 33.5. Delegate to `iru-gate-runner`/`iru-check-security`: scan with `detect-secrets` (no real passwords/tokens/keys/hosts in any example), update `.secrets.baseline`, audit new findings as false positives
    - Done (2026-10-17): 41 new findings (placeholder credentials on localhost/host, checksums/hashes in example output) audited by the user as false positives; rescan reports 0 unlabelled.
    <!-- Not checked: `git add -N` on the 157 new files + `detect-secrets scan --baseline .secrets.baseline` reported 41 NEW, unlabelled findings (36 Hex High Entropy String = checksums/hashes in example output, 3 Basic Auth Credentials = placeholder demo-password/changeit-example/user:password URLs, 2 Secret Keyword = changeit-example signing passphrase and a deployer log line). Triage (is_secret labels) is the user's decision. No private keys, ghp_/AKIA/xox/sk- tokens found by grep. -->
  - [x] Task 33.6. Confirm acceptance criteria one by one (structure, coverage of every inventory and books row, ★ depth, examples with output and `Source:` links, figures, bibliography, cheat sheet, back-links) — 135 pages (10/36/44/45), partials, nav (last include in Programming Languages block, exact title), programming-languages/index bullet+description+keywords+"live only here"; every backticked concept of the inventory and books tables found in the named pages; 64 ★ pages with Source:, real [source,text] output, errors and References; all 31 📊 figures delivered (19 SVGs + Mermaid); Bibliography (1037 links) on index; cheat sheet links the 1-page A4 landscape PDF; 5 back-links present. Minor: index.adoc ends with `== Bibliography` instead of `== References` (same as the Scala/Groovy precedents).

## Notes for execution

- Pages dominate the workload (135); within a parallel group, split work across agents by page, each re-reading its outline bullets.
- Never fabricate output: if a command cannot be run, mark the example "not run here".
- The `.archive/implementation_plan_300.md` copy is produced by `iru-code` on completion.
