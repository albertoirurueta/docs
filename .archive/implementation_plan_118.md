## Task summary

Add Valgrind (Memcheck) coverage to the C and C++ Reference documentation: how to detect memory leaks, how to
**install** Valgrind on the platforms these references already target, and how to **wire it into a CI/CD
pipeline** (a concrete GitHub Actions workflow), per the user's explicit emphasis that installation and CI/CD
setup each need their own clear section rather than being folded only into leak-check examples.

Source: GitHub issue #118
Base branch: main

This is a content-only documentation plan — no `*-code-one-task` skill installed in this repository (`database`,
`dotnet`, `java-springboot`, `java`) applies, since this repo has no application source code; it *is* the Antora
playbook + root component. Every task below is untagged AsciiDoc authoring, consistent with the closest prior
precedents in `.archive/` (`implementation_plan_105.md`/`106.md`/`109.md`/`110.md` — new reference-section
bootstraps, used here only for house conventions, not as a structural template, since this task edits existing
pages rather than creating a new section).

Choices made on the user's behalf (grounded in exploration; nothing else was ambiguous after the user confirmed
Valgrind command output stays illustrative documentation content, not something to actually install/run on this
macOS/Apple Silicon development machine — Valgrind has no working native Apple Silicon build, so this is also
the only way this content *could* be written here):

- **Valgrind console output is illustrative**, matching the existing convention already in these two pages
  (e.g. the sample `==12346== HEAP SUMMARY:` block already in `c/dynamic-memory-allocation.adoc` is synthetic
  sample output, not a captured real run) — not compiled/run-verified the way the C/C{plus}{plus} source examples on
  these pages are.
- **Install commands and the CI YAML are duplicated on both the C and the {cpp} build-and-tooling pages**
  (rather than written once and cross-referenced), matching this repository's existing pattern where each
  language page is self-contained — e.g. CMake usage is documented independently on both pages today rather
  than one page pointing at the other.
- **The GitHub Actions example targets Ubuntu** (`ubuntu-latest`), since Valgrind has no native Windows build
  and only lagging/unofficial macOS support — the pages will say so explicitly rather than presenting a
  Windows/macOS runner example that wouldn't actually work.
- **Valgrind gets its own CI job/section, separate from the existing fast per-commit checks**, because it is
  roughly 20-30x slower than an uninstrumented run — both pages will say to run it as a separate (e.g. nightly
  or manually-triggered) job rather than blocking every commit alongside the existing sanitizer-based checks.

## Current code state

Confirmed by reading the actual files (all paths relative to the repository root):

- **`modules/ROOT/pages/programming-languages/c/build-and-tooling.adoc`** — has a `== Sanitizers and Valgrind`
  section (a single code block covering ASan/UBSan/TSan/MSan and three bare Valgrind invocations, no leak-kind
  detail, no install instructions, no CI/exit-code guidance) and a `== A CI Pipeline` section (generic shell
  commands for formatting/build/tests/static analysis — no Valgrind step at all). Ends with `== See Also` and
  `== References` sections; the latter already links `https://valgrind.org/docs/manual/manual.html`.
- **`modules/ROOT/pages/programming-languages/c/dynamic-memory-allocation.adoc`** — its `== The Classic Defects`
  section's sample output block shows only the `definitely lost` leak category from one
  `valgrind --leak-check=full --show-leak-kinds=all` run.
- **`modules/ROOT/pages/programming-languages/cpp/build-and-tooling.adoc`** — sections today: `== Compilers and
  Flags`, `== CMake`, `== Package Managers: vcpkg and Conan`, `` == `clang-format` ``, `` == `clang-tidy` ``,
  `` == `compile_commands.json` ``, `== Compiler Explorer`, `== See Also`, `== References`. **No Valgrind
  mention anywhere on this page, and no CI-pipeline section at all** (unlike the C page).
- **`modules/ROOT/pages/programming-languages/cpp/memory-management-and-smart-pointers.adoc`** — covers RAII,
  `unique_ptr`/`shared_ptr`/`weak_ptr`, custom deleters, alignment, allocators, and an ownership graph image.
  **No Valgrind mention anywhere.**
- Both build-and-tooling pages' `== See Also` sections already cross-reference each other's page as a whole
  (not to a specific anchor), and `c/dynamic-memory-allocation.adoc` already cross-references
  `cpp/memory-management-and-smart-pointers.adoc` and vice versa — the pattern to follow for the new cross-links
  below is the same: a `xref:` line to the whole page with a one-clause description of what it adds.
- This repository's own build (`npx antora antora-playbook.yml`, or the `iru-build-docs` skill) is the only
  verification available — there is no lint/test suite (per `CLAUDE.md`).

## Implementation steps

### Group 1 — Author the Valgrind content (Parallelizable: yes — four independent files, each edited once, with every section title and cross-reference fixed explicitly below so no coordination between the tasks is needed)

- [x] Task 1. Expand Valgrind coverage on the C build-and-tooling page
  - [x] Task 1.1. In `modules/ROOT/pages/programming-languages/c/build-and-tooling.adoc`, update the page's
        `:description:` and `:keywords:` attribute lines to mention installing Valgrind and CI/GitHub Actions
        (e.g. append "installing Valgrind and running it in GitHub Actions CI" to `:description:`, and add
        `GitHub Actions, CI, apt-get, brew, error-exitcode, suppressions` to `:keywords:`).
  - [x] Task 1.2. Immediately after the existing code block in `== Sanitizers and Valgrind` (the one ending
        `$ valgrind --tool=cachegrind ./app`), add a new `=== Installing Valgrind` subsection with:
        ```
        [source,console]
        ----
        # Debian / Ubuntu
        $ sudo apt-get install valgrind

        # Fedora / RHEL
        $ sudo dnf install valgrind

        # macOS (Homebrew) -- the mainline formula lags behind the newest macOS/Xcode releases;
        # on a recent macOS, use the community tap instead:
        $ brew install valgrind                                    # older macOS
        $ brew tap LouisBrunner/valgrind && brew install --HEAD LouisBrunner/valgrind/valgrind

        # Windows -- no native build; run it inside WSL (Ubuntu), same commands as above.
        ----
        ```
        followed by a `[NOTE]` admonition: Valgrind supports Linux, FreeBSD, Solaris and Android natively;
        macOS support trails new OS releases; there is no native Windows build, so a Windows-only team needs
        WSL or a Linux CI runner (this is why the CI example added in Task 1.4 targets `ubuntu-latest`).
  - [x] Task 1.3. Add a new `=== Interpreting Leak-Check Output` subsection explaining Memcheck's four leak
        categories (from worst to most benign): **definitely lost** (no pointer chain to the block — a real
        leak), **indirectly lost** (lost because the block(s) pointing to it are lost), **possibly lost** (an
        interior-pointer chain — ambiguous, needs judgment), **still reachable** (a pointer to the block still
        exists at exit — often a static/global, frequently not a bug). Include a sample leak summary block
        showing all four (illustrative, not a captured run, consistent with the existing sample block already
        on this page):
        ```
        [source,console]
        ----
        $ valgrind --leak-check=full --show-leak-kinds=all --track-origins=yes ./app
        ==12346== HEAP SUMMARY:
        ==12346==     definitely lost: 40 bytes in 1 blocks
        ==12346==     indirectly lost: 16 bytes in 1 blocks
        ==12346==       possibly lost: 0 bytes in 0 blocks
        ==12346==     still reachable: 72 bytes in 3 blocks
        ----
        ```
        Note `--show-leak-kinds=all` is required to see anything beyond the default
        (`definite,possible`) — `indirectly lost` and `still reachable` are hidden otherwise. Mention
        `--track-origins=yes` separately: it identifies where an uninitialized value came from, at roughly 2x
        further slowdown.
  - [x] Task 1.4. Add a new `=== Suppressions, Exit Codes and Machine-Readable Output` subsection covering:
        `--error-exitcode=<n>` (the flag most naive CI setups omit — without it Valgrind always exits `0` and a
        real leak never fails the build); `--gen-suppressions=all` to generate suppression entries for known/
        third-party noise, saved to a checked-in `.valgrind.supp` file and applied with
        `--suppressions=.valgrind.supp`; and `--xml=yes --xml-file=report.xml` for machine-readable output when
        a CI system wants to parse results rather than just check the exit code. Include a short example
        suppression file:
        ```
        [source]
        ----
        {
           <libc_known_leak>
           Memcheck:Leak
           ...
           fun:malloc
           obj:*/libc.so*
        }
        ----
        ```
  - [x] Task 1.5. In the existing `== A CI Pipeline` section, add a closing `=== Adding a Valgrind Job`
        subsection with a full GitHub Actions workflow example:
        ```
        [source,yaml]
        ----
        name: memcheck

        on:
          push:
            branches: [ main ]
          pull_request:
          schedule:
            - cron: '0 3 * * *'   # nightly -- Valgrind is far slower than the per-commit checks above

        jobs:
          valgrind:
            runs-on: ubuntu-latest

            steps:
              - uses: actions/checkout@v4

              - name: Install Valgrind
                run: sudo apt-get update && sudo apt-get install -y valgrind

              - name: Build (debug, unmodified binary -- Valgrind needs no instrumentation)
                run: |
                  clang -std=c23 -g -O0 -o app *.c

              - name: Run under Memcheck
                run: |
                  valgrind --leak-check=full --show-leak-kinds=all --track-origins=yes \
                           --error-exitcode=1 --suppressions=.valgrind.supp \
                           ./app --self-test
        ----
        ```
        followed by a paragraph explaining the trade-off: Valgrind needs no rebuild/instrumentation and catches
        what ASan/UBSan miss, but is roughly 20-30x slower, so it belongs in a separate/scheduled job (as above)
        rather than the fast per-commit pipeline already shown earlier in this section — the two are
        complementary, not a replacement for one another.
  - [x] Task 1.6. In `== References`, add:
        `https://valgrind.org/docs/manual/quick-start.html[Valgrind -- Quick Start]`,
        `https://valgrind.org/docs/manual/mc-manual.html[Valgrind -- Memcheck manual]`, and
        `https://valgrind.org/downloads/[Valgrind -- Current Releases]`, alongside the existing manual link.

  Note: `modules/ROOT/pages/programming-languages/c/build-and-tooling.adoc` edited -- installation, leak-kind
  interpretation, suppressions/exit-code/XML subsections, a Valgrind CI job, and three new reference links added.
  Documentation-only change; no code-quality/coverage gates apply.

- [x] Task 2. Show all four leak categories in the C dynamic-memory-allocation example
  - [x] Task 2.1. In `modules/ROOT/pages/programming-languages/c/dynamic-memory-allocation.adoc`, in
        `== The Classic Defects`, extend the existing sample output block (currently only
        `definitely lost: 40 bytes in 1 blocks`) to show all four categories, matching Task 1.3's block on the
        build-and-tooling page, and add one sentence pointing to
        `xref:programming-languages/c/build-and-tooling.adoc[C: Build and Tooling]` (already a `See Also`
        entry — just add ", including all four leak categories and how to wire it into CI" to that existing
        line's description) for the full option/CI reference, avoiding duplicating that detail on this page.

  Note: `modules/ROOT/pages/programming-languages/c/dynamic-memory-allocation.adoc` edited -- sample output now
  shows all four leak categories, and the See Also line to the build-and-tooling page now names the CI/leak-kind
  detail it covers. Documentation-only change; no code-quality/coverage gates apply.

- [x] Task 3. Add Valgrind installation, usage and CI coverage to the {cpp} build-and-tooling page
  - [x] Task 3.1. In `modules/ROOT/pages/programming-languages/cpp/build-and-tooling.adoc`, update
        `:description:` and `:keywords:` to add Valgrind, installing Valgrind, and continuous integration with
        GitHub Actions (mirroring Task 1.1's wording, adapted to this page's existing style).
  - [x] Task 3.2. Insert a new `== Valgrind` top-level section between the existing `== Compiler Explorer` and
        `== See Also` sections, containing:
        - `=== Installing Valgrind` — the same install commands and platform-support `[NOTE]` as Task 1.2
          (Debian/Ubuntu `apt-get`, Fedora/RHEL `dnf`, macOS Homebrew + community-tap caveat, no native
          Windows/use WSL).
        - `=== Running Memcheck on {cpp} Binaries` — a short paragraph noting Valgrind instruments compiled
          machine code, so it works transparently on {cpp} binaries with no special flags: it catches raw
          `new`/`delete` mistakes exactly like C's `malloc`/`free`, and correctly follows RAII destructor calls
          and exception unwinding. Include the same invocation as the C page:
          ```
          [source,console]
          ----
          $ valgrind --leak-check=full --show-leak-kinds=all --track-origins=yes ./app
          ----
          ```
          then the four leak categories as a compact bullet list (not a full repeat of the C page's table) —
          definitely lost, indirectly lost, possibly lost, still reachable — with a cross-reference:
          "see xref:programming-languages/c/build-and-tooling.adoc[C: Build and Tooling] for the full
          suppressions/exit-code/XML-output reference, which applies identically here."
  - [x] Task 3.3. Add a new `== Continuous Integration` top-level section (this page has none today), with:
        - A CMake+CTest-based fast per-commit job (build in Debug with `-DENABLE_SANITIZERS=ON`, run `ctest`) —
          reusing the `ENABLE_SANITIZERS` option already defined earlier on this page in the C{plus}{plus}
          `CMakeLists.txt` example.
        - A separate/scheduled Valgrind job, adapted from Task 1.5's YAML for a CMake project:
          ```
          [source,yaml]
          ----
          name: memcheck

          on:
            push:
              branches: [ main ]
            pull_request:
            schedule:
              - cron: '0 3 * * *'   # nightly -- Valgrind is far slower than the sanitizer job above

          jobs:
            valgrind:
              runs-on: ubuntu-latest

              steps:
                - uses: actions/checkout@v4

                - name: Install Valgrind
                  run: sudo apt-get update && sudo apt-get install -y valgrind

                - name: Configure and build (Debug, no sanitizers -- Valgrind instruments the plain binary)
                  run: |
                    cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug
                    cmake --build build -j

                - name: Run tests under Memcheck
                  run: |
                    ctest --test-dir build --output-on-failure \
                      -T memcheck --overwrite MemoryCheckCommand=/usr/bin/valgrind \
                      --overwrite "MemoryCheckCommandOptions=--leak-check=full --show-leak-kinds=all --error-exitcode=1"
          ----
          ```
          followed by a short note that `ctest -T memcheck` (CTest's built-in Valgrind integration, configured
          via `MemoryCheckCommand`) runs every registered test under Memcheck and fails the step on
          `--error-exitcode`, without needing to invoke `valgrind` on each test binary by hand.
  - [x] Task 3.4. Update `== See Also` — extend the existing line referencing
        `xref:programming-languages/c/build-and-tooling.adoc[C: Build and Tooling]` to also mention "the same
        Valgrind installation steps and CI setup" alongside "the same compilers, sanitizers and CMake".
  - [x] Task 3.5. In `== References`, add the same three Valgrind links as Task 1.6.

  Note: `modules/ROOT/pages/programming-languages/cpp/build-and-tooling.adoc` edited -- new `== Valgrind`
  section (installation + Memcheck on {cpp} binaries) and `== Continuous Integration` section (sanitizer job +
  scheduled Valgrind/CTest job) inserted, See Also and References updated. Documentation-only change; no
  code-quality/coverage gates apply.

- [x] Task 4. Note Valgrind's interaction with smart pointers on the {cpp} memory-management page
  - [x] Task 4.1. In `modules/ROOT/pages/programming-languages/cpp/memory-management-and-smart-pointers.adoc`,
        add `Valgrind` to the `:keywords:` attribute line.
  - [x] Task 4.2. Add a new `== Detecting Leaks with Valgrind` section, placed after `== Allocators Overview`
        and before `== Ownership Graph: unique_ptr / shared_ptr / weak_ptr`, covering:
        - Valgrind still catches every raw `new`/`delete` mistake shown earlier on this page (a `new` with no
          matching `delete`, a `new[]`/`delete` mismatch) exactly as it would in C.
        - Smart pointers eliminate most of those, but **do not** prevent a `shared_ptr` reference cycle (two
          objects each holding a `shared_ptr` to the other, per the `weak_ptr` discussion earlier on this
          page) — Valgrind reports the cycle's memory as leaked (or "still reachable", depending on where the
          last live reference sits at program exit), since the reference count never reaches zero. Refer back
          to it in plain prose ("see the `std::shared_ptr` and `std::weak_ptr` section above") rather than an
          `xref` with a guessed anchor ID — don't assume an Antora auto-generated section ID without confirming
          it against the built output.
        - A "still reachable" report for a function-local `static` or namespace-scope global smart pointer at
          program exit is expected, not a bug — mention `--show-leak-kinds=all` is needed to see it at all
          (Memcheck's default `--show-leak-kinds` is `definite,possible`).
        Include one short illustrative example: two classes holding `shared_ptr` to each other, and the
        Valgrind invocation/summary line showing the leaked cycle (illustrative output, consistent with the
        rest of this plan).
  - [x] Task 4.3. Update `== See Also` to add:
        `xref:programming-languages/cpp/build-and-tooling.adoc[{cpp}: Build and Tooling] -- installing Valgrind
        and running it in CI.` (the existing entry there is only
        `programming-languages/c/dynamic-memory-allocation.adoc` — add this as a second bullet, don't replace
        it).

  Note: `modules/ROOT/pages/programming-languages/cpp/memory-management-and-smart-pointers.adoc` edited -- new
  `== Detecting Leaks with Valgrind` section (raw new/delete mistakes, shared_ptr reference cycles, still
  reachable at exit) inserted between Allocators Overview and the Ownership Graph, See Also extended with a
  second bullet. Documentation-only change; no code-quality/coverage gates apply.

### Group 2 — Build and verify (Parallelizable: yes — trivially, a single task; depends on every Group 1 task being complete)

- [x] Task 5. Verify the Antora build succeeds with no `xref`/AsciiDoc errors
  - [x] Task 5.1. Delegate to the `iru-gate-runner` agent (installed in this repository) to run the site build in
        an isolated context, so build log output doesn't consume the main conversation's context window:
        ```
        Agent({
          description: "Build docs site to verify new Valgrind content",
          subagent_type: "iru-gate-runner",
          prompt: "Invoke Skill({skill: \"iru-build-docs\"}) to build this Antora site
            (npx antora antora-playbook.yml) and report back: whether the build succeeded, and the full text of
            any xref/AsciiDoc warnings or errors reported for
            modules/ROOT/pages/programming-languages/c/build-and-tooling.adoc,
            modules/ROOT/pages/programming-languages/c/dynamic-memory-allocation.adoc,
            modules/ROOT/pages/programming-languages/cpp/build-and-tooling.adoc, or
            modules/ROOT/pages/programming-languages/cpp/memory-management-and-smart-pointers.adoc
            specifically. Do not report unrelated pre-existing warnings from other pages unless the build fails
            entirely."
        })
        ```
  - [x] Task 5.2. If the agent reports any error/warning tied to the four files above (e.g. a bad `xref` target,
        an unclosed `[source]` block, a malformed table), fix it directly in the affected file and re-run Task
        5.1 until clean. Pre-existing warnings unrelated to these four files are out of scope for this plan.
