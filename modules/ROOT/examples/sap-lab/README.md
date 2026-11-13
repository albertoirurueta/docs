# SAP lab

Teaching projects for the SAP guides. They run on free tools that install without an account.

**No account is needed or used.** Nothing here asks for an SAP account, an SAP Universal ID, an S-user, a Docker Hub login, a trial tenant or an API key, and no step signs in anywhere. A guide that would need one is not part of the lab.

## What you install

| Tool | Version used | Licence you accept by installing |
|---|---|---|
| Node.js | 22.12 or newer | OpenJS Foundation terms |
| `@sap/cds-dk` and `@sap/cds` | 10.2.1 and 10.2.2 | SAP Developer License Agreement, version 3.2 (the package states that installing or using it means agreeing to the agreement) |
| `@cap-js/sqlite`, `@cap-js/cds-test` | 3.1.2, 1.0.2 | Apache-2.0 |
| UI5 Tooling (`@ui5/cli`) and OpenUI5 | 4.0.73, 1.154.0 | Apache-2.0 |
| `@ui5/linter` | 1.23.8 | Apache-2.0 |
| Google Chrome (not installed by npm; set `CHROME_BIN` if it is not in a default place) | any recent | Google terms |
| `mbt` (Cloud MTA Build Tool) | 1.2.52 | Apache-2.0 |

Every dependency version is pinned in the `package.json` of each project. The lock files were generated against the public npm registry.

## Projects

- `expenses/`: the CAP project used by the SAP guides (`db/`, `srv/`, `app/`, `http/` request files, `test/`). Run `npm install`, then `npm run watch`, and open http://localhost:4004. The guide Your First CAP Service builds its first files (model, service, CSV data) from `cds init`; the draft annotation, the UI annotations and the handler are added by later guides, so this project is the finished state of them.
- `ledger/`: the teaching ledger of the finance guide (journal entries with debit and credit lines, posting periods, posting rules, annotations, `http/` request files, `test/`).
- `ledger-postings/`: the teaching ledger of the guide Follow a Purchase and a Sale through the Ledger (six posting actions for goods receipt, supplier invoice, payment, sale and customer payment, G/L accounts found from transaction keys, GR/IR and open-item clearing, balances and open-items views, annotations, `http/` request files, `test/` with `cds.test`).
- `depreciation/`: the teaching depreciation model of the guide Compute a Depreciation Schedule (assets, a function for straight-line, remaining-life and declining-balance schedules with changeover, a function bound to an asset, `http/` requests, `test/` that checks the worked examples of the SAP Help pages).
- `cost-allocation/`: the teaching model of the guide Allocate Costs and Read a Trial Balance (cost centers, an allocation cycle with tracing factors, an action that posts the lines, a trial balance function, annotations, `http/` request files, `test/`). It is a teaching model, not SAP S/4HANA.
- `people/`: the teaching model of the HR guide (employee records with validity periods and time constraints 1 and 2, annotations, `http/` request files, `test/`).
- `org-structure/`: the teaching model of the guide Build an Organizational Structure Model (objects O, S, C and P, relationships 002, 003, 007, 008 and 012 stored from both ends, rules, an `O-S-P` evaluation path, a tree page, annotations, `http/` request files, `test/`). It is a teaching model, not SAP HCM.
- `payroll-period/`: the teaching model of the guide Compute Pay for a Partial Period and Gross-to-Net (partial-period factor with three methods, gross-to-net in integer cents with generic flat rates, payslips, annotations, `http/` request files, `test/`). It is a teaching model, not SAP Payroll.
- `people-queries/`: the teaching model of the guide Query Effective-Dated Employee Data (read-only service over the `people` data with `asOfDate`, `fromDate` and `toDate` parameters, `http/` request files, `test/`). It is a teaching model, not SAP SuccessFactors.
- `claims-model/`: the teaching claims model of the CAP domain guide (a composition of items, an association to a reference entity, `cuid` and `managed`, a validation handler, a bound action `submit`, `http/` request files, `test/`).
- `claims-ui5/`: the CAP service and the UI5 app of the guide Your First SAPUI5 App (`db/`, `srv/`, `test/`, and `ui/` with `ui5.yaml`, a small proxy middleware and `webapp/`). Run `npm install`, then `npm run watch` in the project folder; in `ui/` run `npm install` and `npm start`, and open http://localhost:8080/index.html?sap-ui-language=en. `npm test` in the project folder.
- `odata-queries/`: the teaching service of the OData query guide (expense claims with items, enough rows to page through, `$select`, `$filter`, `$orderby`, `$top`/`$skip`, `$count`, `$expand`, `$batch`, and writes with POST and PATCH; `http/` request files and `test/`).
- `claims-secured/`: the CAP project of the guide Secure a CAP Service with Roles (a claims service closed with `@requires` and `@restrict`, called with the built-in mocked users `alice` and `bob`, `http/` request files, `test/` with `cds.test`).
- `claims-tested/`: the CAP service of the testing guide (`db/`, `srv/`, `test/` with `cds.test` and `node --test`) and the small UI5 app in `ui5app/` with the UI5 linter, QUnit and OPA5 tests that `npm run ci` runs in a local headless Chrome.
- `claims-mta/`: the small CAP project of the MTA guide (model, service, CSV, and the `mta.yaml` and `xs-security.json` that `cds add mta,hana,xsuaa` writes, `test/`). `mbt` 1.2.52 is installed globally. The build writes only to `gen/`, which is not tracked.
- `partners-s4/`: the partner dashboard of the guide Consume an SAP API Specification in CAP (a projection and handler over the mocked SAP `API_BUSINESS_PARTNER`, sample CSV, `http/` request file, `test/`). The EDMX is not in the repository. In a copy, run `curl -sSL -o API_BUSINESS_PARTNER.edmx https://raw.githubusercontent.com/capire/s4/main/srv/external/API_BUSINESS_PARTNER.edmx` (Apache-2.0, 695 KB) and `cds import API_BUSINESS_PARTNER.edmx --as cds` first, then `npm install` and `npm test`.

These are teaching models built with CAP. They are not SAP S/4HANA or SAP SuccessFactors and do not reproduce their screens.
