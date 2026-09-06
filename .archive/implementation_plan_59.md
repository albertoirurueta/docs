# Implementation Plan: Java Reference — Common Build Plugins on "Build & Tooling"

## Task summary

Source: GitHub issue #59

Expand the existing Java Reference page `modules/ROOT/pages/backend/java/build-and-tooling.adoc` **in place**
with a new section documenting the build plugins virtually every real Java project relies on for testing,
coverage, static analysis, and reporting. Each plugin gets a brief "what it does / why it matters" paragraph
followed by a **paired** `pom.xml` (Maven) and `build.gradle` (Gradle, Groovy DSL) configuration example, in the
same style the page already uses for its Maven/Gradle sections.

Plugins to cover, at minimum: **Surefire** (unit tests), **Failsafe** (integration tests), **JaCoCo** (code
coverage), **Checkstyle** / **PMD** / **SpotBugs** (static analysis), **Javadoc** (API doc generation),
**Maven Site** (report aggregation), plus **two more popular plugins** identified via online research.

The content stays **framework-neutral** — no Spring Boot / Jakarta EE assumptions — making this the
technology-neutral counterpart of the existing Spring-flavoured
`modules/ROOT/pages/backend/springboot/maven-quality-plugins.adoc`.

### Choices made on the user's behalf (best-practice defaults — stated here so they can be challenged in review)

1. **Content-only, untagged plan.** This repo has no application source code; every task is AsciiDoc authoring.
   None of the installed `*-code-one-task` skills (`java`, `dotnet`, `database`) apply, so no task carries a
   language/framework tag — matching every prior documentation plan in `.archive/` (e.g.
   `implementation_plan_57.md`, `implementation_plan_55.md`).
2. **Section placement.** The new section goes **after "Building with Gradle" and before "Generating API Docs
   with `javadoc`"**, titled `== Common Build Plugins`. The existing `javadoc` section stays where it is and is
   cross-linked from the new "Javadoc plugin" subsection (the JDK tool vs. the build-plugin wrapper).
3. **Per-plugin budget.** Short prose (2–4 sentences) + **one** minimal `pom.xml` snippet + **one** minimal
   `build.gradle` snippet per plugin. Deliberately lighter than
   `springboot/maven-quality-plugins.adoc`'s multi-execution configs — the goal is orientation, not a
   copy-paste-complete quality gate. A closing "Wiring it together" note points at `mvn verify` / `gradle check`
   and cross-links the SpringBoot page for the exhaustive treatment.
4. **The two extra plugins** = **Versions** (`versions-maven-plugin` ↔ Gradle `com.github.ben-manes.versions`)
   for dependency-freshness reporting, and **Shade/Shadow** (`maven-shade-plugin` ↔ Gradle
   `com.gradleup.shadow`) for building fat/uber JARs. `maven-enforcer-plugin` gets a one-line honourable
   mention (no first-class Gradle analogue) rather than its own paired example.
5. **Version numbers reused from `springboot/maven-quality-plugins.adoc`** where the same plugin appears there
   (`jacoco-maven-plugin` 0.8.12, `maven-checkstyle-plugin` 3.6.0, `spotbugs-maven-plugin` 4.9.3.2,
   `maven-pmd-plugin` 3.27.0), to avoid gratuitous divergence between the two pages. Versions for plugins not on
   that page (`maven-javadoc-plugin`, `maven-site-plugin`, `versions-maven-plugin`, `maven-shade-plugin`, and
   all Gradle plugin IDs/DSL) are taken from the online research in Task 1 and cited inline.
6. **Gradle "Maven Site" equivalent** is presented as "closest analogue, with caveats": Gradle has no unified
   site concept — cover per-task HTML reports (`reporting { }` / `reports { html }`) plus the legacy
   `build-dashboard` core plugin, explicitly noting it is not a true equivalent.
7. **No diagrams.** This is configuration-example content; `[mermaid]`/SVG add nothing.

## Current code state

- **Target file:** `modules/ROOT/pages/backend/java/build-and-tooling.adoc` (203 lines). Structure today:
  - `:description:` / `:keywords:` attribute lines (must be refreshed to name the new plugins).
  - `include::partial$java-disclaimer.adoc[]`.
  - Intro paragraph + references list.
  - `== The Core JDK Tools`
  - `== Building with Maven` — `pom.xml` skeleton, coordinates, the lifecycle, `mvn` commands.
  - `== Building with Gradle` — `build.gradle` with the `java` plugin, toolchain, `mavenCentral()`,
    `useJUnitPlatform()`, `gradlew` commands.
  - `== Generating API Docs with` `javadoc` — doc-comment example, `javadoc` CLI, `mvn javadoc:javadoc` /
    `./gradlew javadoc`.
  - `== See Also` — 4 xref bullets to sibling Java Reference pages.
  - The page already uses paired `[source,xml]` / `[source,groovy]` blocks and cites official docs as inline
    links — **the new section must match this exact convention.**
  - Surefire is currently named only in a comment (`# compile, then run tests via the Surefire plugin`).
- **Prior art to lift from (framework-neutral parts only):**
  `modules/ROOT/pages/backend/springboot/maven-quality-plugins.adoc` (377 lines) — has vetted **Maven** config
  + prose for JaCoCo (incl. `check` gate), Surefire vs. Failsafe (incl. the `*Test` / `*IT` naming-convention
  rationale), Checkstyle, SpotBugs, PMD, plus "failing the build vs. reporting only". Does **not** cover the
  Javadoc plugin, Maven Site, Versions, or Shade, and has **no Gradle** side. Strip Spring specifics
  (`@SpringBootTest`, Testcontainers, `spring-boot-maven-plugin` start/stop, MapStruct/Lombok) when reusing.
- **Nav / index:** `modules/ROOT/nav.adoc:430` and `modules/ROOT/pages/backend/java/index.adoc` already list
  the page. Expanding it in place needs **no nav change** (issue confirms a sub-nav is not required). The
  index's one-line description of the page (`-- the core JDK tools, a technology-neutral tour of Maven and
  Gradle, and generating API docs with javadoc.`) should be extended to mention the build plugins.
- **Build / verification:** `npx antora antora-playbook.yml` (local content only) must complete with no
  `xref`/AsciiDoc errors. `iru-build-docs` skill wraps this. `build/` is gitignored.
- **No `*-code-one-task` skill applies** — `find .claude/skills -maxdepth 1 -type d -name "*-code-one-task"`
  returns only `java` / `dotnet` / `database`, none of which covers AsciiDoc authoring. `iru-gate-runner` agent
  **is** installed (`.claude/agents/iru-gate-runner.md`).

## Implementation steps

### Group 1 — Research (Parallelizable: yes — single task)

- [x] Task 1. Research and verify current Maven plugins and their Gradle equivalents online — findings recorded
      under `## Research notes (Task 1 output)` at the end of this file (no `.adoc` page touched). Live web
      research done against official docs (maven.apache.org, docs.gradle.org, jacoco.org, spotbugs.readthedocs.io,
      mojohaus.org, plugins.gradle.org, gradleup.com) on 2026-09-06.
  - [x] Task 1.1. For each plugin, confirm from **official documentation** the current coordinates/plugin ID,
        the minimal enabling configuration, and the goal/task that runs it. Capture one canonical doc URL per
        plugin to cite inline in the page:
        - Surefire — `maven-surefire-plugin` (`maven.apache.org/surefire/maven-surefire-plugin/`) ↔ Gradle
          `test` task / `Test` type (`docs.gradle.org` "Testing in Java & JVM projects").
        - Failsafe — `maven-failsafe-plugin` (`maven.apache.org/surefire/maven-failsafe-plugin/`) ↔ Gradle
          custom `integrationTest` source set + task via the `jvm-test-suite` plugin
          (`docs.gradle.org` "JVM Test Suite Plugin") — verify current recommended DSL.
        - JaCoCo — `org.jacoco:jacoco-maven-plugin` 0.8.12 (`jacoco.org/jacoco/trunk/doc/maven.html`) ↔ Gradle
          core `jacoco` plugin (`docs.gradle.org` "The JaCoCo Plugin"), `jacocoTestReport` /
          `jacocoTestCoverageVerification`.
        - Checkstyle — `maven-checkstyle-plugin` 3.6.0 (`maven.apache.org/plugins/maven-checkstyle-plugin/`) ↔
          Gradle core `checkstyle` plugin (`docs.gradle.org` "The Checkstyle Plugin").
        - PMD — `maven-pmd-plugin` 3.27.0 (`maven.apache.org/plugins/maven-pmd-plugin/`) ↔ Gradle core `pmd`
          plugin (`docs.gradle.org` "The PMD Plugin").
        - SpotBugs — `com.github.spotbugs:spotbugs-maven-plugin` 4.9.3.2 (`spotbugs.readthedocs.io`) ↔ Gradle
          `com.github.spotbugs` community plugin (`spotbugs.readthedocs.io` / plugin portal) — confirm latest
          plugin-portal version and DSL block name (`spotbugs { }`).
        - Javadoc — `maven-javadoc-plugin` (`maven.apache.org/plugins/maven-javadoc-plugin/`), `javadoc:javadoc`
          + `javadoc:jar` ↔ Gradle core `javadoc` task + `java { withJavadocJar() }`
          (`docs.gradle.org` "The Java Plugin").
        - Maven Site — `maven-site-plugin` (`maven.apache.org/plugins/maven-site-plugin/`), `<reporting>` +
          `mvn site` ↔ Gradle: per-task `reports { html }` + legacy `build-dashboard` core plugin
          (`docs.gradle.org` "The Build Dashboard Plugin") — note explicitly it is not a true equivalent.
        - Versions — `versions-maven-plugin` (`www.mojohaus.org/versions/`), `versions:display-dependency-updates`
          ↔ Gradle `com.github.ben-manes.versions` plugin (`github.com/ben-manes/gradle-versions-plugin`),
          `dependencyUpdates` task.
        - Shade/Shadow — `maven-shade-plugin` (`maven.apache.org/plugins/maven-shade-plugin/`) ↔ Gradle
          `com.gradleup.shadow` (`gradleup.com/shadow/` — successor to `com.github.johnrengelman.shadow`),
          `shadowJar` task. Confirm the current maintained plugin ID.
        - `maven-enforcer-plugin` (`maven.apache.org/enforcer/maven-enforcer-plugin/`) — one-line mention only;
          note Gradle covers the same ground with dependency resolution rules / `dependencies.constraints` and
          third-party plugins, no single core analogue.
  - [x] Task 1.2. Record the verified findings (plugin → Maven coords/version, Gradle plugin ID/version, key
        goal/task, one doc URL) inline in this plan file under a new `## Research notes (Task 1 output)` heading
        at the end, so Group 2 works from confirmed facts and the citations survive into review. Flag any plugin
        whose Gradle story materially differs from the issue's assumption (esp. Failsafe, Maven Site, Enforcer).
        Done — see `## Research notes (Task 1 output)` below; material differences flagged for the Gradle
        Versions plugin ID (renamed `com.github.ben-manes.versions` → `io.github.ben-manes.versions`), the
        `jvm-test-suite` `check` wiring, Maven Site (no true Gradle equivalent), and Enforcer.

### Group 2 — Author the new section (Parallelizable: no — all sub-tasks edit `build-and-tooling.adoc`)

- [x] Task 2. Add the `== Common Build Plugins` section to
      `modules/ROOT/pages/backend/java/build-and-tooling.adoc`
      -- new `== Common Build Plugins` section added after `== Building with Gradle`, with subsections for
      Surefire/`test`, Failsafe/JVM Test Suite, JaCoCo, Checkstyle/PMD/SpotBugs, the Javadoc plugin, Maven
      Site/`build-dashboard`, Versions + Shade/Shadow + an Enforcer mention, and a `=== Wiring it together`
      close. All paired `[source,xml]` / `[source,groovy]` blocks; every tool inline-linked to official docs.
      No test/coverage/quality tooling applies (AsciiDoc-only repo); Antora build verified separately in Group 3.
  - [x] Task 2.1. Insert the section between `== Building with Gradle` and
        `== Generating API Docs with` `javadoc`. Open with a 3–5 sentence intro: real projects add plugins for
        testing, coverage, static analysis, and reporting; Maven binds them to lifecycle phases, Gradle adds
        them as plugins/tasks; most have a first-class counterpart on the other side. One sentence pointing at
        `xref:backend/springboot/maven-quality-plugins.adoc[Maven Quality Plugins]` for a fuller,
        Spring-oriented treatment of the coverage/static-analysis trio.
  - [x] Task 2.2. `=== Unit tests: Surefire / the `test` task` and
        `=== Integration tests: Failsafe / a separate test suite` — brief prose incl. the `*Test` vs. `*IT`
        naming-convention rationale and why integration tests are kept out of the fast `test` phase; paired
        `[source,xml]` (Surefire `<includes>`/`<excludes>` + Failsafe `integration-test`/`verify` execution)
        and `[source,groovy]` (`useJUnitPlatform()` + a `jvm-test-suite` `integrationTest` suite, per Task 1.1)
        snippets. Cross-link `xref:backend/java/testing.adoc[Testing]`.
  - [x] Task 2.3. `=== Code coverage: JaCoCo` — prose (instruments at test-run time, line/branch coverage,
        `check` turns it into a gate); paired `[source,xml]` (`prepare-agent` + `report` + a `check` rule at
        e.g. 0.80 LINE COVEREDRATIO) and `[source,groovy]` (`jacoco` plugin, `jacocoTestReport`,
        `jacocoTestCoverageVerification` with a `minimum = 0.80` rule) snippets.
  - [x] Task 2.4. `=== Static analysis: Checkstyle, PMD, SpotBugs` — one short paragraph on what each checks
        (Checkstyle = style from source text; PMD = source structure + CPD copy-paste; SpotBugs = compiled
        bytecode for likely bugs); then three compact paired snippets (Maven `<plugin>` with a `check`
        execution bound to `verify` + Gradle core `checkstyle` / `pmd` and `com.github.spotbugs`). Keep each to
        the minimal enabling config (rule-set location, `toolVersion`), not the full exclude/threshold configs
        from the SpringBoot page. One line on "report-only vs. fail-the-build".
  - [x] Task 2.5. `=== API docs: the Javadoc plugin` — distinguish the JDK `javadoc` **tool** (already covered
        below in this page) from the **build plugin** wrapper; paired `[source,xml]` (`maven-javadoc-plugin`
        with `javadoc:jar` bound to `package` for publishing) and `[source,groovy]` (`javadoc` task config +
        `java { withJavadocJar() }`) snippets. Cross-link forward to the existing
        `== Generating API Docs with` `javadoc` section.
  - [x] Task 2.6. `=== Report aggregation: Maven Site` — prose: `mvn site` renders a project website with all
        `<reporting>` plugin outputs (Surefire, JaCoCo, Checkstyle/PMD/SpotBugs, Javadoc) in one place; Gradle
        has no unified equivalent — per-task HTML reports plus the legacy `build-dashboard` plugin are the
        closest thing. Paired `[source,xml]` (`<reporting><plugins>` with 2–3 report plugins) and
        `[source,groovy]` (`build-dashboard` plugin + a note on `reports { html.required = true }`) snippets,
        with the caveat stated in prose.
  - [x] Task 2.7. `=== Also worth knowing` — two more paired examples: **Versions** (`versions:display-*` ↔
        `dependencyUpdates`) and **Shade/Shadow** (uber-JAR: `maven-shade-plugin` `shade` goal ↔ `shadowJar`
        task). One closing sentence naming `maven-enforcer-plugin` as the Maven way to hard-fail on banned
        dependencies / wrong JDK, with Gradle's resolution rules as the rough analogue.
  - [x] Task 2.8. Close the section with a short `==== Wiring it together` (or plain paragraph): `mvn verify`
        runs Surefire + Failsafe + JaCoCo `check` + the static-analysis `check` goals; the Gradle equivalent is
        `gradle check` (which `test` + the analysis plugins all hook into). This is the command CI should gate
        on.
  - [x] Task 2.9. Ensure **every** external reference in the new section is an inline link to official docs
        (using the URLs verified in Task 1), matching the page's existing citation style. No bare tool names
        without a first-mention link.

- [x] Task 3. Update page metadata and cross-references in the same file
  - [x] Task 3.1. Extend `:description:` to add the new coverage (e.g. "... building with Gradle, common build
        plugins for testing, coverage, static analysis and reporting (Surefire, Failsafe, JaCoCo, Checkstyle,
        PMD, SpotBugs, Javadoc, Maven Site), and generating API documentation with javadoc.").
  - [x] Task 3.2. Extend `:keywords:` with: `Surefire, Failsafe, JaCoCo, code coverage, Checkstyle, PMD,
        SpotBugs, static analysis, maven-javadoc-plugin, Maven Site, versions-maven-plugin, maven-shade-plugin,
        Gradle plugins, jvm-test-suite, build-dashboard, shadowJar`.
  - [x] Task 3.3. Add a `== See Also` bullet:
        `* xref:backend/springboot/maven-quality-plugins.adoc[Maven Quality Plugins] -- the same coverage and
        static-analysis plugins configured for a Spring Boot Maven build, with multi-module aggregation.`
  - [x] Task 3.4. In `modules/ROOT/pages/backend/java/index.adoc`, extend the one-line description of the
        Build & Tooling entry to mention the build plugins (e.g. "... a technology-neutral tour of Maven and
        Gradle, the common build plugins (testing, coverage, static analysis, reporting), and generating API
        docs with `javadoc`.").

### Group 3 — Verify the Antora build (Parallelizable: yes — single task)

- [x] Task 4. Build the docs site and confirm no AsciiDoc/xref regressions
      -- `npx antora antora-playbook.yml` (local content only) completed with exit code 0 and zero
      warnings/errors at the default log level. No `xref`/AsciiDoc message references `build-and-tooling.adoc`,
      its `== Common Build Plugins` section, or `index.adoc`. Two pre-existing `info`-level "possible invalid
      reference" notes remain (`database/schema-evolution/liquibase-rollback.adoc`; remote `ai-catalog`
      `guides/extending-the-catalog.adoc`) — unrelated to this change, not fixed. No code-quality/test/coverage
      tooling applies (AsciiDoc-only repo).
  - [x] Task 4.1. Delegated to the `iru-gate-runner` agent, which ran `iru-build-docs` (`npm ci` +
        `npx antora antora-playbook.yml`, no `--fetch`). Build completed; zero xref/AsciiDoc warnings or
        errors. All 8 inbound `xref:backend/java/build-and-tooling.adoc[...]` references resolve.
        `build/site/backend/java/build-and-tooling.html` generated (111 KB).
  - [x] Task 4.2. Not required — the build reported no `xref`/AsciiDoc error or warning attributable to the
        new content (or to anything else). No fix to `build-and-tooling.adoc` needed.
  - [x] Task 4.3. Rendered-page sanity check on `build/site/backend/java/build-and-tooling.html` passed:
        `== Common Build Plugins` renders after "Building with Gradle" and before "Generating API Docs with
        javadoc", with all 8 planned subsections in order (Surefire, Failsafe, JaCoCo, static analysis,
        Javadoc plugin, Maven Site, Also worth knowing, Wiring it together). All 8 paired
        `[source,xml]` + 8 `[source,groovy]` blocks render (`language-xml` / `language-groovy`). Zero
        unresolved xrefs. `xref:backend/springboot/maven-quality-plugins.adoc` → `../springboot/maven-quality-plugins.html`
        and `xref:backend/java/testing.adoc` → `testing.html` both resolve; the in-page `<<generating-api-docs,covered below>>`
        link targets the `generating-api-docs` anchor on the existing heading. The new `== See Also` bullet
        "Maven Quality Plugins" resolves. `+...+` passthrough globs (`**/*IT.java`, `**/*Test.java`) render
        literally in prose.

## Research notes (Task 1 output)

Verified against official documentation on **2026-09-06** via live web research. "Plan assumption" = the
version/ID written in the Group 1 task text or in "Choices made on the user's behalf". Where the plan
deliberately reuses an older version from `springboot/maven-quality-plugins.adoc` (choice #5), that is noted and
is **not** a defect — Group 2 should follow choice #5 unless review says otherwise.

### Per-plugin findings

| # | Concern | Maven side (groupId:artifactId — latest release) | Key Maven goal(s) | Gradle side (plugin id — latest) | Key Gradle task(s) | Canonical doc URL to cite |
|---|---------|--------------------------------------------------|-------------------|----------------------------------|--------------------|---------------------------|
| 1 | Unit tests | `org.apache.maven.plugins:maven-surefire-plugin` — **3.6.0** | `surefire:test` (bound to `test` phase); `<includes>`/`<excludes>` default `**/Test*.java`, `**/*Test.java`, `**/*Tests.java`, `**/*TestCase.java` | core `java` plugin — n/a (built in) | `test` task (type `Test`); `test { useJUnitPlatform() }` | https://maven.apache.org/surefire/maven-surefire-plugin/ &middot; https://docs.gradle.org/current/userguide/java_testing.html ("Testing in Java & JVM projects") |
| 2 | Integration tests | `org.apache.maven.plugins:maven-failsafe-plugin` — **3.6.0** (official page shows 3.6.0; a `3.6.0-M1` milestone also exists — cite **3.6.0**) | `failsafe:integration-test` + `failsafe:verify` (bound to `integration-test`/`verify` phases); default pattern `**/IT*.java`, `**/*IT.java`, `**/*ITCase.java` | core `jvm-test-suite` plugin (**still `incubating`**) | custom `integrationTest` suite via `testing { suites { integrationTest(JvmTestSuite) { … } } }`; **`check` does NOT auto-depend on it** — must add `tasks.named('check') { dependsOn(testing.suites.integrationTest) }`; also `dependencies { implementation project() }` and `shouldRunAfter(test)` are needed | https://maven.apache.org/surefire/maven-failsafe-plugin/ &middot; https://docs.gradle.org/current/userguide/jvm_test_suite_plugin.html |
| 3 | Code coverage | `org.jacoco:jacoco-maven-plugin` — latest **0.8.15** (plan/choice #5 reuses **0.8.12** from the SpringBoot page — keep 0.8.12 unless review bumps it) | `jacoco:prepare-agent`, `jacoco:report` (bind to `test`/`verify`), `jacoco:check` (rule e.g. `LINE` / `COVEREDRATIO` `0.80`) | core `jacoco` plugin (id `jacoco`) — versioned with Gradle | `jacocoTestReport` (`reports { xml.required = true }`), `jacocoTestCoverageVerification` (`violationRules { rule { limit { minimum = 0.80 } } }`) | https://www.jacoco.org/jacoco/trunk/doc/maven.html &middot; https://docs.gradle.org/current/userguide/jacoco_plugin.html |
| 4 | Style checks | `org.apache.maven.plugins:maven-checkstyle-plugin` — **3.6.0** (matches plan) | `checkstyle:check` (bind to `verify`); `<configLocation>` (e.g. `google_checks.xml` / `sun_checks.xml`) | core `checkstyle` plugin (id `checkstyle`) | `checkstyleMain` / `checkstyleTest` (**`check` depends on both**); `checkstyle { toolVersion = '…' }` | https://maven.apache.org/plugins/maven-checkstyle-plugin/ &middot; https://docs.gradle.org/current/userguide/checkstyle_plugin.html |
| 5 | Source-structure + copy-paste | `org.apache.maven.plugins:maven-pmd-plugin` — latest **3.28.0** (plan says 3.27.0 — safe to bump to 3.28.0 for a page not on the SpringBoot page's reuse list) | `pmd:check` + `pmd:cpd-check` (bind to `verify`); `<rulesets>` | core `pmd` plugin (id `pmd`) | `pmdMain` / `pmdTest` (`check` depends on both); `pmd { toolVersion = '…'; ruleSets = [...] }`; **no CPD task in the core Gradle plugin** | https://maven.apache.org/plugins/maven-pmd-plugin/ &middot; https://docs.gradle.org/current/userguide/pmd_plugin.html |
| 6 | Bytecode bug patterns | `com.github.spotbugs:spotbugs-maven-plugin` — latest **4.10.3.0** (plan/choice #5 reuses **4.9.3.2** from the SpringBoot page — keep unless review bumps it) | `spotbugs:check` (bind to `verify`), `spotbugs:spotbugs`, `spotbugs:gui` | community `com.github.spotbugs` plugin — latest **6.5.11** (portal, 2026-08-20); needs Gradle ≥ 7.0 | `spotbugsMain` / `spotbugsTest` (depend on `check`); extension block **`spotbugs { }`** with `toolVersion` (other props like `ignoreFailures`, `effort`, `reportLevel` are on `SpotBugsExtension` / per-task) | https://spotbugs.readthedocs.io/en/latest/maven.html &middot; https://spotbugs.readthedocs.io/en/latest/gradle.html |
| 7 | API docs (build plugin) | `org.apache.maven.plugins:maven-javadoc-plugin` — **3.12.0** | `javadoc:javadoc` (HTML), `javadoc:jar` (bind to `package` for publishing), `javadoc:aggregate` | core `java` plugin | `javadoc` task (type `Javadoc`, depends on `classes`); `java { withJavadocJar() }` adds a `-javadoc.jar` publication artifact (companion: `withSourcesJar()`) | https://maven.apache.org/plugins/maven-javadoc-plugin/ &middot; https://docs.gradle.org/current/userguide/java_plugin.html |
| 8 | Report aggregation / project site | `org.apache.maven.plugins:maven-site-plugin` — stable **3.22.0** (a `4.0.0-M*` line exists but is **milestone-only**, not released — cite **3.22.0**) | `site:site`, `site:run`, `site:stage`, `site:deploy`; reads the POM `<reporting><plugins>` section | **no true Gradle equivalent.** Closest analogue: core `build-dashboard` plugin (id `build-dashboard`) + per-task `reports { html.required = true }` | `buildDashboard` task (aggregates reports other plugins already produce; **not run by `check`/`build`**; **disables the Configuration Cache when applied**) | https://maven.apache.org/plugins/maven-site-plugin/ &middot; https://docs.gradle.org/current/userguide/build_dashboard_plugin.html |
| 9 | Dependency-freshness report | `org.codehaus.mojo:versions-maven-plugin` — **2.21.0** | `versions:display-dependency-updates`, `versions:display-plugin-updates` | **`io.github.ben-manes.versions`** — latest **0.61.0** (2026-08-09). ⚠️ The `com.github.ben-manes.versions` id in the plan is **deprecated** (namespace moved from `com.github.ben-manes` → `io.github.ben-manes` in **v0.55.0**; old id still publishes but logs a deprecation warning) | `dependencyUpdates` task | https://www.mojohaus.org/versions/versions-maven-plugin/ &middot; https://plugins.gradle.org/plugin/io.github.ben-manes.versions |
| 10 | Fat / uber JAR | `org.apache.maven.plugins:maven-shade-plugin` — **3.6.2** | `shade:shade` (bind to `package`) | **`com.gradleup.shadow`** — latest **9.6.1** (2026-07-22); successor to `com.github.johnrengelman.shadow` (the plan's target id `com.gradleup.shadow` is correct) | `shadowJar` task | https://maven.apache.org/plugins/maven-shade-plugin/ &middot; https://gradleup.com/shadow/ |
| 11 | Build-rule enforcement (mention only) | `org.apache.maven.plugins:maven-enforcer-plugin` — **3.6.3** | `enforcer:enforce` (rules: `requireMavenVersion`, `requireJavaVersion`, `bannedDependencies`, `dependencyConvergence`, …) | **no single core analogue.** Gradle covers the same ground with `dependencies.constraints`, dependency `resolutionStrategy` / `failOnVersionConflict()`, rich version constraints, and third-party plugins | n/a | https://maven.apache.org/enforcer/maven-enforcer-plugin/ &middot; https://docs.gradle.org/current/userguide/dependency_constraints.html |

### Material differences from the plan's assumptions (call-outs for Group 2 and review)

1. **Gradle Versions plugin ID is renamed (was `com.github.ben-manes.versions`).** Use
   **`id 'io.github.ben-manes.versions' version '0.61.0'`** in the `build.gradle` snippet for Task 2.7. The old
   `com.github.ben-manes.versions` id still works but emits a deprecation warning (namespace moved in v0.55.0).
   Task 2.7 / the plan's choice #4 should be updated to the new id; optionally add a half-sentence noting the
   rename. The `dependencyUpdates` task name is unchanged.
2. **Failsafe → `jvm-test-suite`: the `check` wiring is not automatic and the plugin is still `incubating`.**
   The Task 2.2 Gradle snippet must include `tasks.named('check') { dependsOn(testing.suites.integrationTest) }`
   (plus `dependencies { implementation project() }` inside the suite and `shouldRunAfter(test)` on the target),
   and the prose should note the API is incubating. This is close to the plan's assumption but the explicit
   wiring is easy to omit.
3. **Maven Site has no true Gradle equivalent — keep the "closest analogue, with caveats" framing (choice #6).**
   `build-dashboard` (core, id `build-dashboard`, task `buildDashboard`) only *aggregates* reports that other
   plugins already generate, is not invoked by `check`/`build`, and **disables the Configuration Cache when
   applied** — state that caveat in prose for Task 2.6.
4. **Enforcer has no one-liner Gradle plugin.** Task 2.7's closing sentence should point at Gradle
   *dependency constraints / resolution strategy* (e.g. `failOnVersionConflict()`, rich version declarations)
   rather than implying a drop-in plugin.
5. **Minor version currency (not blockers):** latest `jacoco-maven-plugin` is **0.8.15** (plan reuses 0.8.12 via
   choice #5), latest `spotbugs-maven-plugin` is **4.10.3.0** (plan reuses 4.9.3.2 via choice #5), latest
   `maven-pmd-plugin` is **3.28.0** (plan text says 3.27.0). `maven-checkstyle-plugin` **3.6.0** matches the
   plan. Recommend: keep the choice-#5 reuse values for JaCoCo/SpotBugs for cross-page consistency; bump PMD to
   3.28.0 since this page is not in the reuse set. Flag all four in review so the user can decide.
6. **New/updated version numbers for plugins not on the SpringBoot page (use these in Group 2, cite inline):**
   `maven-surefire-plugin` 3.6.0, `maven-failsafe-plugin` 3.6.0, `maven-javadoc-plugin` 3.12.0,
   `maven-site-plugin` 3.22.0, `versions-maven-plugin` 2.21.0, `maven-shade-plugin` 3.6.2,
   `maven-enforcer-plugin` 3.6.3; Gradle community plugins: `com.github.spotbugs` 6.5.11,
   `io.github.ben-manes.versions` 0.61.0, `com.gradleup.shadow` 9.6.1. Gradle **core** plugins
   (`java`, `jacoco`, `checkstyle`, `pmd`, `jvm-test-suite`, `build-dashboard`) are versioned with Gradle
   itself and take no `version` in the `plugins { }` block.
