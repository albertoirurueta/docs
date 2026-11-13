# CAP and UI5 feasibility for the SAP guides, checked on 2026-11-13

Probe projects: throwaway directories outside the repository, installed from the public npm registry. No account, sign-in, API key or Docker image was used. The only download outside npm was one public file from GitHub (task 4.3).

## Versions and licences

| Package | Version | Licence | Note |
|---|---|---|---|
| `@sap/cds-dk` | 10.2.1 | SAP Developer License Agreement 3.2 (`SEE LICENSE IN LICENSE`) | The licence text states that downloading, installing or using the SAP materials means agreeing to it. The lab page must say so and name the licence; whoever follows the lab accepts it by installing |
| `@sap/cds` (installed by `cds-dk` and by `cds init`) | 10.2.2 | SAP Developer License Agreement | needs Node.js 22.12 or newer |
| `@cap-js/sqlite` | 3.1.2 | Apache-2.0 | in-memory SQLite for development |
| `@cap-js/cds-test` | 1.0.2 | Apache-2.0 | needed by `cds.test`; not installed by `cds init`, so add it with `npm i -D @cap-js/cds-test` |
| `@ui5/cli` (UI5 Tooling) | 4.0.73 | Apache-2.0 | |
| `@openui5/sap.m`, `sap.ui.core`, `sap.ui.layout`, `sap.ui.unified`, `themelib_sap_horizon` | 1.154.0 | Apache-2.0 | downloaded by UI5 Tooling from npm into `~/.ui5/framework` |
| `mbt` (Cloud MTA Build Tool, npm wrapper) | 1.2.52 | Apache-2.0 | its install script downloads the `cloud-mta-build-tool` binary from the project's public GitHub release; the script did not run automatically here (npm held it back), so it was run once by hand with `node install cloud-mta-build-tool` in the package folder |
| Node.js | 24.21.0 | | 22.12 or newer is required |

## What ran

| Step | Result |
|---|---|
| `cds init expenses --nodejs`, an entity with `cuid` and `managed` from `@sap/cds/common`, a service with `@odata.draft.enabled`, a CSV file under `db/data/`, `npm install` | works. `cds init` creates `app/`, `db/`, `srv/`, `eslint.config.mjs`, `package.json` with `"type": "module"`, `@sap/cds` ^10 and `@cap-js/sqlite` ^3 |
| `cds watch` | works. Log: model loaded, `sqlite { url: ':memory:' }`, data initialised from the CSV, `using auth strategy { kind: 'mocked' }`, service served. `$metadata` returns HTTP 200; `GET /odata/v4/expense/Claims` returns the CSV row; `$filter`, `$select` and `$count=true` work |
| Fiori elements preview (`/$fiori-preview/ExpenseService/Claims#preview-app`), with `@UI.LineItem`, `@UI.HeaderInfo`, `@UI.Facets` and a field group | works in the browser: a list report with filter bar, Go button, Create and Delete buttons and the table. The preview loads SAPUI5 **1.145.0** from `sapui5.hana.ondemand.com` (the CDN version is chosen by `cds-dk`, not 1.154). Texts follow the browser locale. The object page was not opened in this probe; it is checked when the Fiori guide is run |
| Custom handler (`before('SAVE', 'Claims', ...)`) | loads without error; its behaviour is checked when the domain-model guide is run |
| `@requires: 'authenticated-user'` plus `@restrict` with mocked users, tested with `cds.test` | works: anonymous request gets **401**, `alice` can read, `bob` gets **403** on a write (`alice` holds the admin role in the mocked users, so she can write) |
| `cds.test` with `node --test` (Node's built-in runner) | works after `npm i -D @cap-js/cds-test` |
| `cds add mta`, then `cds add hana,xsuaa`, then `mbt build -t gen --mtar expenses.mtar` | works: `mta.yaml` holds `expenses-srv`, `expenses-db-deployer` (hdb), `expenses-auth` (managed service) and `expenses-db` (HDI container); `mbt build` ran `npm ci` and `cds build --production` and wrote a 2.8 MB `.mtar` (5.8 MB with the HANA and XSUAA descriptors). Nothing was deployed. A `package-lock.json` must exist (`npm install --package-lock-only`) |
| UI5 Tooling with OpenUI5 1.154.0 (`ui5 serve`) and an XML view | works: the page renders and `sap.ui.version` is 1.154.0. The framework libraries must be listed **only** in `ui5.yaml`; listing them also in `package.json` makes `ui5 serve` stop with "Duplicate framework dependency definition(s)" |

## Task 4.3: public EDMX for SAP Business Partner

The SAP Business Accelerator Hub needs a login to download a specification (the SAP-samples CodeJam exercise says so in terms: "You need to be logged on to the SAP Business Accelerator Hub to download specifications"), so the hub is not used.

A login-free copy exists: **`capire/s4`**, "Pre-built integration package for SAP S/4HANA", published by the CAP team.

- File: https://github.com/capire/s4/blob/main/srv/external/API_BUSINESS_PARTNER.edmx (raw: https://raw.githubusercontent.com/capire/s4/main/srv/external/API_BUSINESS_PARTNER.edmx), 695 KB, OData V2 EDMX of `API_BUSINESS_PARTNER`
- Licence: Apache-2.0 (repository `LICENSE`; the readme states "Copyright (c) 2026 SAP SE or an SAP affiliate company ... licensed under the Apache Software License, version 2.0"). Last commit 2026-09-08. The readme calls it a sample, not for production use
- Probe: `cds import API_BUSINESS_PARTNER.edmx` produced `srv/external/API_BUSINESS_PARTNER.csn` with 19 references to `A_BusinessPartner`. A projection `Partners` over `A_BusinessPartner`, with a CSV file named `API_BUSINESS_PARTNER-A_BusinessPartner.csv` under `srv/external/data/`, ran under `cds watch` ("mocking API_BUSINESS_PARTNER") and `GET /odata/v4/bp/Partners` returned the CSV row

The guide tells the reader to download the file from that URL (the file is not vendored into this repository) and states the licence.

## Verdict per guide

| Guide | Verdict | Reason |
|---|---|---|
| `guide-first-cap-service.adoc` | **keep** | `cds init`, entity, service, CSV, `cds watch`, `$metadata` and the entity set all ran |
| `guide-cap-domain-model-and-custom-logic.adoc` | **keep** | `cuid` and `managed` ran; the handler loaded. Associations, compositions and an action are written and run at writing time (same toolchain) |
| `guide-cap-fiori-elements-app.adoc` | **keep** | The list report preview ran with `@UI` annotations and draft enabled. Object page, value help and draft editing are checked at writing time; the guide names the preview's SAPUI5 version (1.145.0) as what the reader sees |
| `guide-first-sapui5-app.adoc` | **keep** | UI5 Tooling with OpenUI5 1.154.0 ran. Reaching the CAP service from a separate `ui5 serve` origin needs a proxy or CORS decision, settled when the guide is run (the CAP project can also serve the app from its own `app/` folder) |
| `guide-query-odata-services.adoc` | **keep** | `$select`, `$filter`, `$count` ran. `$expand`, `$orderby`, `$top`/`$skip`, `$batch` and a write run on the same service at writing time |
| `guide-secure-a-cap-service.adoc` | **keep** | 401 and 403 with mocked users ran |
| `guide-test-cap-and-ui5.adoc` | **trim** | `cds.test` with `node --test` ran. No headless browser runner for QUnit or OPA5 was probed, so the "run them as a CI pipeline would" step is reduced to opening the QUnit and OPA5 test pages served by `ui5 serve` in a browser; a headless runner is added only if it is run and recorded |
| `guide-build-an-mta-archive.adoc` | **keep** | `cds add mta`, `cds add hana,xsuaa` and `mbt build` to a local `.mtar` ran |
| `guide-consume-an-sap-api-from-cap.adoc` | **keep** | Public EDMX found (above); `cds import` and the mocked service ran. Not dropped |
| Finance guides (`ledger`, 4 guides) | **keep** | The teaching models are CAP apps on the toolchain above (entities, handlers, functions, views, Fiori elements preview). Each is run end to end when written |
| HR guides (`people`, 4 guides) | **keep** | Same reason |

No guide is dropped. The SAP-general, Finance and HR guides all share one toolchain, so a failure of that toolchain would affect all of them; it ran here without any account.
