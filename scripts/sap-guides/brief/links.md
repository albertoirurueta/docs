# Confirmed link map for the outline links (issue #400)

Checked on 2026-11-13. help.sap.com pages were checked in a real browser session against the portal's own metadata service (a topic that does not exist is reported as missing, a topic that exists resolves to its deliverable and file); the other hosts were requested over HTTP and, for pages that block scripted requests, opened in the browser. No sign-in was used anywhere.

## Prefix map (corrected)

| Token | Base URL to use | Change |
|---|---|---|
| `KD:` | `https://help.sap.com/docs/abap-cloud/abap-keywords/` | The deliverable slug is now `abap-keywords` (plural). The old `abap-keyword` still resolves, so all 60 `KD:` and ABAP-Cloud keyword links work either way; new pages use the plural form. Topic slugs are unchanged. |
| `KS:` | `https://help.sap.com/docs/abap-cloud/abap-keywords-standard-abap/<topic-slug>` | The old `help.sap.com/doc/abapdocu_latest_index_htm/latest/en-US/<file>.html` path redirects to the readable topic URL (checked for `abapauthority-check.html`, which lands on `authority-check-object`). All 19 `KS:` files exist. Cite the readable URL the portal redirects to, or the legacy path when no slug is known. |
| `RAP:` | `https://help.sap.com/docs/abap-cloud/abap-rap/` | unchanged |
| `DM:` | `https://help.sap.com/docs/abap-cloud/abap-data-models/` | unchanged |
| `ADT:` | `https://help.sap.com/docs/abap-cloud/abap-development-tools-user-guide/` | unchanged |
| `CS:` | `https://github.com/SAP-samples/abap-cheat-sheets/blob/main/` | GitHub resolves the bare folder to `/tree/main`; file links work |
| `PLAT:` | `https://help.sap.com/docs/ABAP_PLATFORM_NEW/` | unchanged |
| `BTP:` | `https://help.sap.com/docs/btp/sap-business-technology-platform/` | unchanged; the portal product name is still "SAP Business Technology Platform (SAP BTP)" |
| `CAP:` | `https://cap.cloud.sap/docs/` | unchanged |
| `LRN:` | `https://learning.sap.com/courses/` | unchanged |
| `OP:` | `https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/` | version label "2025 FPS02 (Oct 2026)" |
| `CL:` | `https://help.sap.com/docs/SAP_S4HANA_CLOUD/` | version label "2608 Latest" |
| `PYBS:` | `https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/ff854a903cbf4c10910a5825d787693f/` | except the two topics `d9cae...` and `dccae...`, which live in the HCM-for-S/4HANA deliverable `c6c3ffd90792427a9fee1a19df5b0925` (see replacements) |
| `ITPA:` | `https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/4890f6fdb74a48339baba97ef3d921f0/` | unchanged |
| `SFAPI:` | `https://help.sap.com/docs/successfactors-platform/sap-successfactors-api-reference-guide-odata-v2/` | version label "2H 2026" |
| `S4HR:` | `https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/c6c3ffd90792427a9fee1a19df5b0925/` | HCM for SAP S/4HANA deliverable (the H4S4 documentation), version label "2025 FPS02 (Oct 2026)" |

## Replacements (the outline URL did not resolve or pointed at the wrong page)

| Outline URL | Problem | Use instead |
|---|---|---|
| `SAP_S4HANA_ON-PREMISE/ff854a903cbf4c10910a5825d787693f/dccae05320a7424de10000000a174cb4.html` | moved to another deliverable | `https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/c6c3ffd90792427a9fee1a19df5b0925/dccae05320a7424de10000000a174cb4.html` |
| `SAP_S4HANA_ON-PREMISE/ff854a903cbf4c10910a5825d787693f/d9cae05320a7424de10000000a174cb4.html` | moved to another deliverable | `https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/c6c3ffd90792427a9fee1a19df5b0925/d9cae05320a7424de10000000a174cb4.html` |
| `hana-cloud-database/sap-hana-cloud-sap-hana-database-deployment-infrastructure-hdi-reference/sap-hdi-container-schemas` | page does not exist | `https://help.sap.com/docs/HANA_CLOUD_DATABASE/c2cc2e43458d4abda6788049c58143dc/71ed23cbded54f6297440a53d949ff06.html` |
| `sap-ai-core/sap-ai-core-service-guide/models-and-scenarios-in-generative-ai-hub` | page does not exist | `https://help.sap.com/docs/AI_LAUNCHPAD/cdafa069e3834fd398b1507245be0844/fef463b24bff4f44a33e98bb1e4f3148.html` |
| `abap-cloud/abap-cloud/test` | resolves, but to an unrelated page titled "Test" (a chapter on testing a Fiori app), not to the ABAP Test Cockpit | `https://help.sap.com/docs/ABAP_Cloud/bfed5a0f77a2488990788127f9271d15/0614c6b643ab4852a36db2d24d90193e.html` |

For the generative AI hub, the overview page `https://help.sap.com/docs/AI_CORE/2d6c5984063c40a59eda62f4a9135bee/a126bd67458945e881ec3fed2746e576.html` also exists. For SQLScript, the reference is `https://help.sap.com/docs/HANA_CLOUD_DATABASE/d1cb63c8dd8e4c35a0f18aef632687f0/28f2d64d4fab4e789ee0070be418419d.html`. For the ATC, the ABAP environment page `https://help.sap.com/docs/ABAP_ENVIRONMENT/250515df61b74848810389e964f8c367/f0b71a1c959842258772c27d292c43b0.html` ("Test in the ABAP Test Cockpit") also exists.

## Topics with and without an official help page (task 2.2)

| Topic | Result | Source to cite |
|---|---|---|
| `HR_READ_INFOTYPE` | No page of its own. Described inside the infotype-reading topics | `https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/c6c3ffd90792427a9fee1a19df5b0925/c29ee2539c70424de10000000a174cb4.html` (Reading Infotypes) and `.../69a5e2539c70424de10000000a174cb4.html`; the module's own documentation is **in-system documentation** (transaction SE37) |
| `HR_INFOTYPE_OPERATION` | No official product-documentation page. Mentioned only in SAP Support knowledge-base articles | Label the function module as **in-system documentation** (SE37); do not link a knowledge-base article as the reference |
| `PM01` | No official page. The only hits are the plant-maintenance order type PM01, a different object | Label as **in-system documentation**; cite the PA30/PA40 topics `https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/c6c3ffd90792427a9fee1a19df5b0925/d0d050d3c2e24a1e8fcb342dae94c6e5.html` (Managing Infotype Menus) and `.../cc38e153a217424de10000000a174cb4.html` (Working with the Object Manager) |
| S/4HANA off-cycle payroll | **Pages exist** (the outline expected none) | `https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/9ea99bc6cccf4f62b6cf70e7196b7a79/dd54116e00ec4d9aacee04f206b27a3e.html` (Ad Hoc Off-Cycle Payroll: Bonus), `.../f474cd383b9b46d08cfb431413d25938.html` (Registering Ad Hoc Off-Cycle Requests in Payroll Activity Lists), `https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/9d6aaa82e6ab4efbab9311826e0beac8/8f3ba898127b40c291e1a9c63129390a.html` (Bonus Payments, infotype 0267); Employee Central Payroll: `https://help.sap.com/docs/SAP_SUCCESSFACTORS_EMPLOYEE_CENTRAL_PAYROLL/427486e0f6ee4cd9a7edcae683af2c06/c773d27221e3448e96cc5ada5525813d.html` |

## Publisher pages for the bibliographies (task 2.1)

| Book | Page to cite | Checked |
|---|---|---|
| B1 Complete ABAP, 1st ed. 2016 (ISBN 978-1-4932-1272-9) | https://www.sap-press.com/complete-abap_5567/ | The 1st-edition URL `complete-abap_3921` and the 2nd-edition URL `complete-abap_4947` both redirect to `_5567`, the current edition (ISBN 978-1-4932-2305-3, updated for ABAP 2021). There is no page for the 1st edition; cite the current page and say in prose that the copy consulted is the 1st edition. |
| B2 ABAP Objects, Keller and Krüger, 1st ed. 2002 (ISBN 978-0-201-75080-5) | https://www.informit.com/store/sap.kellerabap-objectsc-9780201750805 | Page exists: Addison-Wesley Professional, published May 13, 2002, 1st edition. The outline URL ended with a stray full stop, which makes it return 404. |
| B3 ABAP Development for SAP HANA, 1st ed. 2014 (ISBN 978-1-59229-859-4) | https://www.sap-press.com/abap-development-for-sap-hana_3973/ | The page exists but lists ISBN 978-1-4932-1304-7, the successor edition. No page for the 1st edition exists (out of print); cite this page and state that the consulted copy is the 1st edition. |
| B4 ABAP RESTful Programming Model, 1st ed. 2019 (ISBN 978-1-4932-1903-2) | https://www.sap-press.com/abap-restful-programming-model_4988/ | ISBN matches. |
| B5 SAP API Management, 1st ed. 2019 (ISBN 978-1-4932-1860-8) | https://www.sap-press.com/sap-api-management_4928/ | ISBN matches. |
| B6 Configuring SAP S/4HANA Finance, 3rd ed. 2025 (ISBN 978-1-4932-2620-7) | https://www.sap-press.com/configuring-sap-s4hana-finance_5920/ | ISBN matches the 3rd edition. The earlier-edition pages `_4857` and `_5361` are not used. |
| B7 SAP S/4HANA Financial Accounting Configuration, 2nd ed. 2023 (ISBN 978-1-4842-8956-3 print) | https://doi.org/10.1007/978-1-4842-8957-0 | Resolves to the Springer Nature Link page for the Apress book: softcover ISBN 978-1-4842-8956-3, e-book 978-1-4842-8957-0, published December 2022, copyright 2023. |
| B8 SAP ERP HCM Technical Principles and Programming, 1st ed. 2013 (ISBN 978-1-59229-431-2) | https://www.sap-press.com/sap-erp-hcm-technical-principles-and-programming_3698/ | The page lists ISBN 978-1-4932-1170-8, the 2nd edition. No page for the 1st edition exists; cite this page and state that the consulted copy is the 1st edition. |
| B6 (Jotev) 3rd edition page | https://www.sap-press.com/configuring-sap-s4hana-finance_5920/ | Same as B6 above. |

## Other hosts

All other outline URLs returned HTTP 200 (GitHub, developers.sap.com, learning.sap.com, tools.hana.ondemand.com, ui5.sap.com, news.sap.com, docs.abapgit.org and others). Redirects to adopt:

- `https://developers.sap.com/mission.cp-starter-extensions-cap.html` redirects to `https://developers.sap.com/tutorials/mission-build-a-business-application-using-cap-for-node-js`
- `https://developers.sap.com/tutorials/abap-environment-rap100-generate-ui-service.html` redirects to `https://developers.sap.com/tutorials/abap-environment-rap100-generate-ui-service`
- `https://developers.sap.com/tutorials/abap-install-adt.html` redirects to `https://developers.sap.com/tutorials/abap-install-adt`
- `https://fioriappslibrary.hana.ondemand.com` redirects to `https://fioriappslibrary.hana.ondemand.com:443/sap/fix/externalViewer/`
- `https://help.sap.com/doc/abapdocu_latest_index_htm/latest/en-US/` redirects to `https://help.sap.com/docs/abap-cloud/abap-keywords-standard-abap`
- `https://learning.sap.com/courses/` redirects to `https://learning.sap.com/courses`
- `https://learning.sap.com/learning-journeys/learn-the-basics-of-abap-programming-on-sap-btp` redirects to `https://learning.sap.com/courses/learning-the-basics-of-abap-programming`
- `https://sap.github.io/jenkins-library/guidedtour` redirects to `https://www.project-piper.io/guidedtour/`
- `https://tools.hana.ondemand.com/latest` redirects to `https://tools.hana.ondemand.com/latest/`
- `https://www.sap.com/design-system/fiori-design-web/` and `https://www.sap.com/documents/2022/10/52e0cd9b-497e-0010-bca6-c68f7e60039b.html` block scripted requests (HTTP 403) but open in a browser. The second is a landing page for a 2022 PDF titled "Extend SAP S/4HANA in the cloud and on premise with ABAP based extensions"; the PDF itself was not opened, so the clean core levels are cited to the SAP Cloud ALM help page (see `baseline.md`).
- `https://api.sap.com` pages need a sign-in for downloads (the SAP Business Accelerator Hub EDMX download requires a login), so no page cites an API hub download.

## Every help.sap.com topic that was checked

`found` means the portal metadata service resolved the topic. The 60 `abap-keyword` entries are cited as `abap-keywords`.

| Status | Topic |
|---|---|
| found | `ABAP_PLATFORM_NEW/166400f6be7b46e8adc6b90fd20f3516/485f9ba265c907dce10000000a42189d.html` |
| found | `ABAP_PLATFORM_NEW/46a2cfc13d25463b8b9a3d2a3c3ba0d9/8ff2e540f8648431e10000000a1550b0.html` |
| found | `ABAP_PLATFORM_NEW/8f3819b0c24149b5959ab31070b64058/4ab5eadb22526d6de10000000a42189c.html` |
| found | `ABAP_PLATFORM_NEW/c238d694b825421f940829321ffa326a/804c251e9c19426cadd1395978d3f17b.html` |
| found | `ABAP_PLATFORM_NEW/cc0c305d2fab47bd808adcad3ca7ee9d/f65634b0b2ef4a13b562d9b42fc65f0c.html` |
| found | `FIORI_IMPLEMENTATION/ac6a9cb75ca741589de37d373f7cb0c6/6f0e415370107d77e10000000a441470.html` |
| found | `HR_RENEWAL/4946a4f5c2d7427c96d89242e1ff2d9a/1b9fe2539c70424de10000000a174cb4.html` |
| found | `SAP_FIORI/d59d9f81f4884bf9b115936b92c27202/0a03119967b84a6b98ff0ecbf0a077b2.html` |
| found | `SAP_S4HANA_CLOUD/031c345485b84c8c94265be9ef61d3a8/45698054f87c033de10000000a441470.html` |
| found | `SAP_S4HANA_CLOUD/0f69f8fb28ac4bf48d2b57b9637e81fa/533228e1e854433ab16d013f161ca509.html` |
| found | `SAP_S4HANA_CLOUD/0fa84c9d9c634132b7c4abb9ffdd8f06/950f8054747b053de10000000a441470.html` |
| found | `SAP_S4HANA_CLOUD/0fa84c9d9c634132b7c4abb9ffdd8f06/bd874158706b9144e10000000a4450e5.html` |
| found | `SAP_S4HANA_CLOUD/0fa84c9d9c634132b7c4abb9ffdd8f06/db6ed77578d84b42aed62ae3b1324c07.html` |
| found | `SAP_S4HANA_CLOUD/53e36b5493804bcdb3f6f14de8b487dd/c926d691d7144f7dba16f8e12ad81d28.html` |
| found | `SAP_S4HANA_CLOUD/918bca53037f408f91a2295d04ac16bc/6709022d64ab4789a0b6ba5b941e278f.html` |
| found | `SAP_S4HANA_CLOUD/918bca53037f408f91a2295d04ac16bc/e616af23d2b947fbb275deb759b7090b.html` |
| found | `SAP_S4HANA_CLOUD/918bca53037f408f91a2295d04ac16bc/e74a1f567afbdf21e10000000a4450e5.html` |
| found | `SAP_S4HANA_CLOUD/b978f98fc5884ff2aeb10c8fdeb8a43b/8aa29c6ac8234f9a9b975b3900aa002d.html` |
| found | `SAP_S4HANA_CLOUD/b978f98fc5884ff2aeb10c8fdeb8a43b/f5c8d0579212c525e10000000a4450e5.html` |
| found | `SAP_S4HANA_CLOUD/c56f622a2edf491b9f1b596b55587009/fa8f7e6786974fa0bb1cfd0266a98f36.html` |
| found | `SAP_S4HANA_CLOUD/e6175604fc874bfe84aa14d2f9ae1fbd/5c8c2825535f4e3aa9b7f716a0085221.html` |
| found | `SAP_S4HANA_CLOUD/e6175604fc874bfe84aa14d2f9ae1fbd/9ec635ecc22a4559b1070b2dd2c879e4.html` |
| found | `SAP_S4HANA_ON-PREMISE/0a09147b661744fc81907d489d68a1e6/74f77a093f634e959dc5d8d5945c9dbc.html` |
| found | `SAP_S4HANA_ON-PREMISE/0bfd0ef8ac604566b03299809b86b10e/3c71a457bc4a6c10e10000000a441470.html` |
| found | `SAP_S4HANA_ON-PREMISE/0f095921571d4e94a53bfaa5f6dc120d/64dbd35339874308e10000000a174cb4.html` |
| found | `SAP_S4HANA_ON-PREMISE/19fd959a061b4cccbbda9081688d41e9/914f8d6384744de0839b2d95df9c93c5.html` |
| found | `SAP_S4HANA_ON-PREMISE/3cb1182b4a184bdd93f8d62e3f1f0741/12f6c353fad0b44ce10000000a174cb4.html` |
| found | `SAP_S4HANA_ON-PREMISE/3cb1182b4a184bdd93f8d62e3f1f0741/8a8cd1538cdf4608e10000000a174cb4.html` |
| found | `SAP_S4HANA_ON-PREMISE/3cb1182b4a184bdd93f8d62e3f1f0741/c55fd353c6244308e10000000a174cb4.html` |
| found | `SAP_S4HANA_ON-PREMISE/3cb1182b4a184bdd93f8d62e3f1f0741/d5b6e9c22275409ca63435eea41abab6.html` |
| found | `SAP_S4HANA_ON-PREMISE/3cb1182b4a184bdd93f8d62e3f1f0741/ee9cd1538cdf4608e10000000a174cb4.html` |
| found | `SAP_S4HANA_ON-PREMISE/3cb1182b4a184bdd93f8d62e3f1f0741/fdcbae52f0ecc04ae10000000a44176d.html` |
| found | `SAP_S4HANA_ON-PREMISE/3f7761ea74cf4ee9864b8ab713636fe5/6b6ec2531bb9b44ce10000000a174cb4.html` |
| found | `SAP_S4HANA_ON-PREMISE/4890f6fdb74a48339baba97ef3d921f0/0078dd538636424de10000000a174cb4.html` |
| found | `SAP_S4HANA_ON-PREMISE/4890f6fdb74a48339baba97ef3d921f0/119bc2531bb9b44ce10000000a174cb4.html` |
| found | `SAP_S4HANA_ON-PREMISE/4890f6fdb74a48339baba97ef3d921f0/479bc2531bb9b44ce10000000a174cb4.html` |
| found | `SAP_S4HANA_ON-PREMISE/4890f6fdb74a48339baba97ef3d921f0/81c5c353b677b44ce10000000a174cb4.html` |
| found | `SAP_S4HANA_ON-PREMISE/4890f6fdb74a48339baba97ef3d921f0/feb3c2531bb9b44ce10000000a174cb4.html` |
| found | `SAP_S4HANA_ON-PREMISE/4ebf1502064b406c964b0911adfb3f01/51462dd29ef9486a86ec3d202f2f22fb.html` |
| found | `SAP_S4HANA_ON-PREMISE/5e23dc8fe9be4fd496f8ab556667ea05/266cb949a0414d1bb30c4a6550d55835.html` |
| found | `SAP_S4HANA_ON-PREMISE/5e23dc8fe9be4fd496f8ab556667ea05/700ad553088f4308e10000000a174cb4.html` |
| found | `SAP_S4HANA_ON-PREMISE/5e23dc8fe9be4fd496f8ab556667ea05/7a03c353fad0b44ce10000000a174cb4.html` |
| found | `SAP_S4HANA_ON-PREMISE/5e23dc8fe9be4fd496f8ab556667ea05/82c2b70ff84c4eebb14fe45c12d5aed4.html` |
| found | `SAP_S4HANA_ON-PREMISE/5e23dc8fe9be4fd496f8ab556667ea05/87b9bd54c3378e21e10000000a44176d.html` |
| found | `SAP_S4HANA_ON-PREMISE/5e23dc8fe9be4fd496f8ab556667ea05/97f1d353ca9f4408e10000000a174cb4.html` |
| found | `SAP_S4HANA_ON-PREMISE/5e23dc8fe9be4fd496f8ab556667ea05/bd7a0c53e0658b4ae10000000a441470.html` |
| found | `SAP_S4HANA_ON-PREMISE/5e23dc8fe9be4fd496f8ab556667ea05/c141de531ed3424de10000000a174cb4.html` |
| found | `SAP_S4HANA_ON-PREMISE/5e23dc8fe9be4fd496f8ab556667ea05/dd3dd253913e4608e10000000a174cb4.html` |
| found | `SAP_S4HANA_ON-PREMISE/621c00a46ed247ffa5a2a311de7e3535/c5c2dc53b5ef424de10000000a174cb4.html` |
| found | `SAP_S4HANA_ON-PREMISE/651d8af3ea974ad1a4d74449122c620e/09218af9292a45d7ac5d99f092b6a7c1.html` |
| found | `SAP_S4HANA_ON-PREMISE/651d8af3ea974ad1a4d74449122c620e/15f6c353fad0b44ce10000000a174cb4.html` |
| found | `SAP_S4HANA_ON-PREMISE/651d8af3ea974ad1a4d74449122c620e/381146531c9eac48e10000000a423f68.html` |
| found | `SAP_S4HANA_ON-PREMISE/651d8af3ea974ad1a4d74449122c620e/4911c9cc2a934a18e10000000a42189b.html` |
| found | `SAP_S4HANA_ON-PREMISE/651d8af3ea974ad1a4d74449122c620e/523b8a55559ad007e10000000a44538d.html` |
| found | `SAP_S4HANA_ON-PREMISE/651d8af3ea974ad1a4d74449122c620e/6b63c7531dc61d4be10000000a174cb4.html` |
| found | `SAP_S4HANA_ON-PREMISE/651d8af3ea974ad1a4d74449122c620e/8450d7531a4d424de10000000a174cb4.html` |
| found | `SAP_S4HANA_ON-PREMISE/651d8af3ea974ad1a4d74449122c620e/8a4fd7531a4d424de10000000a174cb4.html` |
| found | `SAP_S4HANA_ON-PREMISE/651d8af3ea974ad1a4d74449122c620e/8b8e5695c4dc4749a706f9fa2f6bda92.html` |
| found | `SAP_S4HANA_ON-PREMISE/651d8af3ea974ad1a4d74449122c620e/9f53c2531bb9b44ce10000000a174cb4.html` |
| found | `SAP_S4HANA_ON-PREMISE/651d8af3ea974ad1a4d74449122c620e/b152d7531a4d424de10000000a174cb4.html` |
| found | `SAP_S4HANA_ON-PREMISE/651d8af3ea974ad1a4d74449122c620e/be4fd7531a4d424de10000000a174cb4.html` |
| found | `SAP_S4HANA_ON-PREMISE/67e323b7117e4c91869c258933f47182/0914d25320cd4608e10000000a174cb4.html` |
| found | `SAP_S4HANA_ON-PREMISE/67e323b7117e4c91869c258933f47182/3564d652bc8fbe66e10000000a441470.html` |
| found | `SAP_S4HANA_ON-PREMISE/67e323b7117e4c91869c258933f47182/473dde531ed3424de10000000a174cb4.html` |
| found | `SAP_S4HANA_ON-PREMISE/67e323b7117e4c91869c258933f47182/4c004352f770aa1ae10000000a445394.html` |
| found | `SAP_S4HANA_ON-PREMISE/67e323b7117e4c91869c258933f47182/a19cc2531bb9b44ce10000000a174cb4.html` |
| found | `SAP_S4HANA_ON-PREMISE/6b356c79dea443c4bbeeaf0865e04207/c53deb5765c7be12e10000000a4450e5.html` |
| found | `SAP_S4HANA_ON-PREMISE/6ce333200159404793eb5784647ca0df/a1963035bbcb4940a238eaa194a34efe.html` |
| found | `SAP_S4HANA_ON-PREMISE/749809c7d9fa45109f25cadf78827f31/bd18dd5321e8424de10000000a174cb4.html` |
| found | `SAP_S4HANA_ON-PREMISE/74b0b157c81944ffaac6ebc07245b9dc/beccd7570afba073e10000000a441470.html` |
| found | `SAP_S4HANA_ON-PREMISE/888cbe952a0e4a729f8b823d69860929/5792333ddf3c47eaad4314b071dfd684.html` |
| found | `SAP_S4HANA_ON-PREMISE/8b1d76cd5e7644caa0553fcf338f3982/3fe49e8767d648a6b1b5edeec8849b8d.html` |
| found | `SAP_S4HANA_ON-PREMISE/ac319d8fa4ea4624b40a58d23e3c4627/f07b8854c46ee75ee10000000a44176d.html` |
| found | `SAP_S4HANA_ON-PREMISE/c6c3ffd90792427a9fee1a19df5b0925/18cbddfa5691416d8f004dc97ac98634.html` |
| found | `SAP_S4HANA_ON-PREMISE/d9b2188095ad4922bd9977126e0d92b7/ae5bdd5321e8424de10000000a174cb4.html` |
| found | `SAP_S4HANA_ON-PREMISE/e9aa251b81eb4842bff926f04a251916/544ce6cddaf24902b928e2a1ffe23406.html` |
| found | `SAP_S4HANA_ON-PREMISE/ee6ff9b281d8448f96b4fe6c89f2bdc8/0ee5e95760521070e10000000a44147b.html` |
| found | `SAP_S4HANA_ON-PREMISE/ee6ff9b281d8448f96b4fe6c89f2bdc8/47dce95760521070e10000000a44147b.html` |
| found | `SAP_S4HANA_ON-PREMISE/ff854a903cbf4c10910a5825d787693f/1c3ec2531bb9b44ce10000000a174cb4.html` |
| found | `SAP_S4HANA_ON-PREMISE/ff854a903cbf4c10910a5825d787693f/1c515747d6164336acd41e6598b49a66.html` |
| found | `SAP_S4HANA_ON-PREMISE/ff854a903cbf4c10910a5825d787693f/1f3ec2531bb9b44ce10000000a174cb4.html` |
| found | `SAP_S4HANA_ON-PREMISE/ff854a903cbf4c10910a5825d787693f/223ec2531bb9b44ce10000000a174cb4.html` |
| found | `SAP_S4HANA_ON-PREMISE/ff854a903cbf4c10910a5825d787693f/253ec2531bb9b44ce10000000a174cb4.html` |
| found | `SAP_S4HANA_ON-PREMISE/ff854a903cbf4c10910a5825d787693f/2b3ec2531bb9b44ce10000000a174cb4.html` |
| found | `SAP_S4HANA_ON-PREMISE/ff854a903cbf4c10910a5825d787693f/373ec2531bb9b44ce10000000a174cb4.html` |
| found | `SAP_S4HANA_ON-PREMISE/ff854a903cbf4c10910a5825d787693f/493ec2531bb9b44ce10000000a174cb4.html` |
| replaced | `SAP_S4HANA_ON-PREMISE/ff854a903cbf4c10910a5825d787693f/d9cae05320a7424de10000000a174cb4.html` |
| replaced | `SAP_S4HANA_ON-PREMISE/ff854a903cbf4c10910a5825d787693f/dccae05320a7424de10000000a174cb4.html` |
| found | `SAP_S4HANA_ON-PREMISE/ff854a903cbf4c10910a5825d787693f/f54ddd538636424de10000000a174cb4.html` |
| found | `SAP_S4HANA_ON-PREMISE/ffd3025c2c294692928bf690ac41e147/5786d0531d8b4208e10000000a174cb4.html` |
| found | `SAP_SUCCESSFACTORS_EMPLOYEE_CENTRAL_PAYROLL/185f14fbe60d4bbb8d7d5e4f8d89b24b/bbcdc6f97e3742feb07da924e0293761.html` |
| found | `SAP_SUCCESSFACTORS_PLATFORM/534356acc0ab4b0e8977ebfb2eb432f7/a1f11920dfa941beac3c755db53fbdd4.html` |
| replaced | `abap-cloud/abap-cloud/test` |
| found | `abap-cloud/abap-cloud/why-abap-cloud` |
| found | `abap-cloud/abap-concepts/background-processing-framework` |
| found | `abap-cloud/abap-concepts/controlled-sap-luw` |
| found | `abap-cloud/abap-data-models/abap-data-models` |
| found | `abap-cloud/abap-data-models/cds-authorization-concept` |
| found | `abap-cloud/abap-development-tools-user-guide/getting-started` |
| found | `abap-cloud/abap-development-tools-user-guide/profiling-abap-code` |
| found | `abap-cloud/abap-development-tools-user-guide/working-with-classic-objects-in-abap-dictionary` |
| found | `abap-cloud/abap-keyword/abap-abap-objects` |
| found | `abap-cloud/abap-keyword/abap-apis` |
| found | `abap-cloud/abap-keyword/abap-cds-access-control` |
| found | `abap-cloud/abap-keyword/abap-cds-annotations` |
| found | `abap-cloud/abap-keyword/abap-cds-feature-tables` |
| found | `abap-cloud/abap-keyword/abap-cds-type-definitions` |
| found | `abap-cloud/abap-keyword/abap-core-data-services-abap-cds` |
| found | `abap-cloud/abap-keyword/abap-dictionary-ddic` |
| found | `abap-cloud/abap-keyword/abap-eml` |
| found | `abap-cloud/abap-keyword/abap-language-version` |
| found | `abap-cloud/abap-keyword/abap-managed-database-procedures-amdp` |
| found | `abap-cloud/abap-keyword/abap-release-news` |
| found | `abap-cloud/abap-keyword/abap-sql` |
| found | `abap-cloud/abap-keyword/abap-sql-performance-notes` |
| found | `abap-cloud/abap-keyword/abap-unit` |
| found | `abap-cloud/abap-keyword/amdp-table-function` |
| found | `abap-cloud/abap-keyword/authority-check-object` |
| found | `abap-cloud/abap-keyword/call-method-static-method-call-obsolete` |
| found | `abap-cloud/abap-keyword/cds-association` |
| found | `abap-cloud/abap-keyword/cds-metadata-extension` |
| found | `abap-cloud/abap-keyword/cds-table-function` |
| found | `abap-cloud/abap-keyword/cds-view-entity` |
| found | `abap-cloud/abap-keyword/character-string-template` |
| found | `abap-cloud/abap-keyword/common-table-expression` |
| found | `abap-cloud/abap-keyword/control-structure` |
| found | `abap-cloud/abap-keyword/corresponding-component-operator` |
| found | `abap-cloud/abap-keyword/data-inline-declaration-for-variables` |
| found | `abap-cloud/abap-keyword/ddic-data-element` |
| found | `abap-cloud/abap-keyword/ddic-database-table` |
| found | `abap-cloud/abap-keyword/ddic-enhancement-category-of-structures` |
| found | `abap-cloud/abap-keyword/ddic-structure` |
| found | `abap-cloud/abap-keyword/elementary-data-type` |
| found | `abap-cloud/abap-keyword/enhancements-using-badis` |
| found | `abap-cloud/abap-keyword/events` |
| found | `abap-cloud/abap-keyword/exception-handling` |
| found | `abap-cloud/abap-keyword/filter-filter-operator` |
| found | `abap-cloud/abap-keyword/final-inline-declaration-for-immutable-variables` |
| found | `abap-cloud/abap-keyword/for-conditional-iteration` |
| found | `abap-cloud/abap-keyword/function-module` |
| found | `abap-cloud/abap-keyword/function-module-interface` |
| found | `abap-cloud/abap-keyword/host-variable` |
| found | `abap-cloud/abap-keyword/interfaces` |
| found | `abap-cloud/abap-keyword/internal-tables-itab` |
| found | `abap-cloud/abap-keyword/itab-table-expressions-table-exp` |
| found | `abap-cloud/abap-keyword/loop-at-itab-group-by` |
| found | `abap-cloud/abap-keyword/raise-event` |
| found | `abap-cloud/abap-keyword/rap-bdl-feature-tables` |
| found | `abap-cloud/abap-keyword/rap-behavior-definition` |
| found | `abap-cloud/abap-keyword/rap-business-service` |
| found | `abap-cloud/abap-keyword/rap-draft-handling` |
| found | `abap-cloud/abap-keyword/rap-glossary` |
| found | `abap-cloud/abap-keyword/reduce-reduction-operator` |
| found | `abap-cloud/abap-keyword/released-api` |
| found | `abap-cloud/abap-keyword/sap-luw` |
| found | `abap-cloud/abap-keyword/secondary-table-key` |
| found | `abap-cloud/abap-keyword/select-from-hierarchy-data` |
| found | `abap-cloud/abap-keyword/sql-path-expression` |
| found | `abap-cloud/abap-keyword/try` |
| found | `abap-cloud/abap-keyword/value-value-operator` |
| found | `abap-cloud/abap-keyword/window-expression` |
| found | `abap-cloud/abap-rap/abap-restful-application-programming-model` |
| found | `abap-cloud/abap-rap/authorization-control` |
| found | `abap-cloud/abap-rap/business-events` |
| found | `abap-cloud/abap-rap/business-object-implementation-types` |
| found | `abap-cloud/abap-rap/business-object-projection` |
| found | `abap-cloud/abap-rap/draft` |
| found | `abap-cloud/abap-rap/odata-ui-service-from-scratch` |
| found | `abap-cloud/abap-rap/optimistic-concurrency-control` |
| found | `abap-cloud/abap-rap/pessimistic-concurrency-control-locking` |
| found | `abap-cloud/abap-rap/unmanaged-save` |
| found | `btp/sap-business-technology-platform/account-model` |
| found | `btp/sap-business-technology-platform/application-jobs` |
| found | `btp/sap-business-technology-platform/correction-and-transport-system` |
| found | `btp/sap-business-technology-platform/entitlements-and-quotas` |
| found | `btp/sap-business-technology-platform/environments` |
| found | `btp/sap-business-technology-platform/kyma-environment` |
| found | `btp/sap-business-technology-platform/what-is-sap-authorization-and-trust-management-service` |
| found | `btp/sap-business-technology-platform/xco-library?version=Cloud` |
| found | `build-service/build-service-guide/what-is-sap-build` |
| found | `cloud-alm/applicationhelp/extensibility` |
| found | `cloud-alm/applicationhelp/working-with-transports` |
| found | `cloud-identity-services/cloud-identity-services/what-is-identity-authentication` |
| found | `connectivity/sap-btp-connectivity-cf/http-destinations` |
| found | `connectivity/sap-btp-connectivity-cf/what-is-sap-btp-connectivity` |
| found | `event-mesh/event-mesh/rest-apis-for-events` |
| replaced | `hana-cloud-database/sap-hana-cloud-sap-hana-database-deployment-infrastructure-hdi-reference/sap-hdi-container-schemas` |
| found | `integration-suite/sap-integration-suite/what-is-sap-integration-suite` |
| replaced | `sap-ai-core/sap-ai-core-service-guide/models-and-scenarios-in-generative-ai-hub` |
| found | `successfactors-ec-s4-hcm-integration/implementing-data-replication-from-employee-central/introduction-to-data-replication-from-employee-central-to-sap-s-4hana` |
| found | `successfactors-platform/implementing-metadata-framework-mdf/business-rules-in-mdf` |
| found | `successfactors-platform/implementing-metadata-framework-mdf/what-is-metadata-framework` |
| found | `successfactors-platform/sap-successfactors-api-reference-guide-odata-v2/about-employee-central-odata-apis` |
| found | `successfactors-platform/sap-successfactors-api-reference-guide-odata-v2/authentication-using-oauth-2-0` |
| found | `successfactors-platform/sap-successfactors-api-reference-guide-odata-v2/effective-dating` |
| found | `successfactors-platform/sap-successfactors-api-reference-guide-odata-v2/empjob` |
| found | `successfactors-platform/sap-successfactors-api-reference-guide-odata-v2/examples` |
| found | `successfactors-platform/sap-successfactors-api-reference-guide-odata-v2/supported-features` |
| found | `KS:abapauthority-check.html` |
| found | `KS:abapcall_function_update.html` |
| found | `KS:abapcall_screen.html` |
| found | `KS:abapcommit.html` |
| found | `KS:abapparameters.html` |
| found | `KS:abapselect-options.html` |
| found | `KS:abenabap_dynpro_list.html` |
| found | `KS:abenabap_dynpros_value_help_auto.html` |
| found | `KS:abenabap_screens.html` |
| found | `KS:abenabap_subroutines.html` |
| found | `KS:abenbapi_glosry.html` |
| found | `KS:abenevent_block_glosry.html` |
| found | `KS:abenlock_object_glosry.html` |
| found | `KS:abennews.html` |
| found | `KS:abenobj_oriented_gdl.html` |
| found | `KS:abenrfc.html` |
| found | `KS:abensap_lock.html` |
| found | `KS:abensecondary_key_guidl.html` |
| found | `KS:abenselection_screen.html` |
