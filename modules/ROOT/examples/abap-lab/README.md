# ABAP lab

A local ABAP playground built on open-abap, a community open-source transpiler that runs a subset of the ABAP language in Node.js. It is not SAP software. It has no ABAP Dictionary tools, no CDS, no RAP, no SAP GUI and no released SAP APIs.

**No account is needed or used.** Nothing here asks for an SAP account, a trial, a Docker Hub login or a key.

## What you install

| Tool | Version used | Licence |
|---|---|---|
| Node.js | 22.12 or newer | OpenJS Foundation terms |
| `@abaplint/transpiler-cli`, `@abaplint/runtime` | 2.14.30 | MIT |
| `@abaplint/database-sqlite` | 2.14.12 | MIT |
| `@abaplint/cli` | 2.120.103 | MIT |
| open-abap-core (cloned by the transpiler from GitHub) | commit `a9acc41`, 2026-11-12 | MIT |

## Use

Run `npm install`, then:

- `npm test` transpiles `src/` and runs the ABAP Unit tests (exit code 1 when a test fails);
- `npm run run:hello` runs the `ZHELLO` report;
- `npm run run:first` runs the `ZFIRST_PROGRAM` report of the guide Your First ABAP Program;
- `npm run run:summary` runs the `ZDT_SUMMARY` report of the guide Data Types, Strings and String Templates;
- `npm run run:items` runs the `ZIT_INTERNAL_TABLES` report of the guide Work with Internal Tables;
- `npm run run:claims` runs the `ZOO_CLAIMS_REPORT` report of the guide Classes, Interfaces and Exceptions;
- `npm run run:sql` runs the `ZSQL_CLAIMS` report of the guide ABAP SQL on a Local Database;
- `npm test` also runs the tests of the guide Write ABAP Unit Tests;
- `npm run lint:demo` checks the flawed class in `lint-demo/` for the guide Check Code against Clean ABAP Rules (it reports findings on purpose);
- `npm run lint` runs abaplint with the rules of `abaplint.json`.

Sources use the abapGit file layout (`name.type.abap` plus `name.type.xml`). The database is an in-memory SQLite database created from the table definitions under `src/` by `setup.mjs`.
