# What Group 24 must wire (nav, index and cross-links)

Group 23 did not add any entry for `cheat-sheet.adoc` or `bibliography.adoc`, because an `xref:` to a page that does not exist
makes `npm run test:nav:site` report a broken nav link. When each page exists, add exactly these lines, then run
`npm run cards` (turns the cheat-sheet link into the download button), `npm run test:cards`, `npm run test:nav` and a fresh build
followed by `npm run test:nav:site`.

## Nav: `modules/ROOT/partials/nav-abap.adoc`
Append at the end, under the `** Evolution and reference` group (after the Glossary entry):
```
*** xref:programming-languages/abap/cheat-sheet.adoc[Cheat Sheet (PDF)]
*** xref:programming-languages/abap/bibliography.adoc[Bibliography]
```

## Nav: `modules/ROOT/nav.adoc` (ERP block, between E-commerce and CMS)
The three areas end with a `Reference` group that currently holds only the Glossary. Append:

SAP general (the `**** Reference` group of the SAP entry, level `*****`):
```
***** xref:erp/sap/cheat-sheet.adoc[Cheat Sheet (PDF)]
***** xref:erp/sap/bibliography.adoc[Bibliography]
```
Finance (the `***** Reference` group under `**** xref:erp/sap/finance/index.adoc[Finance]`, level `******`):
```
****** xref:erp/sap/finance/cheat-sheet.adoc[Cheat Sheet (PDF)]
```
Human Resources (the `***** Reference` group under `**** xref:erp/sap/human-resources/index.adoc[Human Resources]`, level `******`):
```
****** xref:erp/sap/human-resources/cheat-sheet.adoc[Cheat Sheet (PDF)]
```
Finance and Human Resources have no bibliography entry of their own: both link to `erp/sap/bibliography.adoc`.

## Index pages: the `== What's covered` lists
Add the same entries to the matching list so the nav and the text list stay identical.
* `programming-languages/abap/index.adoc`, last group `=== Evolution and reference`: add
  `* xref:programming-languages/abap/cheat-sheet.adoc[Cheat Sheet (PDF)]` and
  `* xref:programming-languages/abap/bibliography.adoc[Bibliography]` after the Glossary bullet.
* `erp/sap/index.adoc`, group `=== Reference`: change the intro sentence to mention the cheat sheet and the bibliography and add the two bullets
  (`erp/sap/cheat-sheet.adoc`, `erp/sap/bibliography.adoc`) after the Glossary bullet.
* `erp/sap/finance/index.adoc` and `erp/sap/human-resources/index.adoc`, group `=== Reference`: add the cheat-sheet bullet.

## Index pages: the `== Bibliography` paragraph
Each of the four indexes has a paragraph that says "A bibliography page lists ..." (or "The ... section of the shared bibliography page ...") without a link.
Turn the words "bibliography page" into links:
* `programming-languages/abap/index.adoc`: `xref:programming-languages/abap/bibliography.adoc[bibliography page]`.
* `erp/sap/index.adoc`: `xref:erp/sap/bibliography.adoc[bibliography page]`.
* `erp/sap/finance/index.adoc`: `xref:erp/sap/bibliography.adoc#_finance[Finance section of the shared bibliography page]` (the anchor is allowed in body text, never in the nav).
* `erp/sap/human-resources/index.adoc`: `xref:erp/sap/bibliography.adoc#_human_resources[Human Resources section of the shared bibliography page]`.
  Check the anchors against the `===` headings that Task 258 writes (`General`, `Finance`, `Human Resources`).
* `erp/index.adoc` (`== Bibliography`): link the words "A bibliography page" to `erp/sap/bibliography.adoc`.

## Intro mentions
`erp/sap/index.adoc`, the intro and the `:description:` already say "a cheat sheet and a bibliography"; `programming-languages/abap/index.adoc`
and the Finance and HR `:description:` lines do the same for the cheat sheet. Nothing to change there once the pages exist.
