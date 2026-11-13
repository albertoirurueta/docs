# SAP logo decision for the cards (task 5), 2026-11-13

**Decision: use a drawn glyph (`gl:...`) for every SAP card. Never use or redraw the SAP logo.**

Evidence:

- Simple Icons 16.37.0 (the version pinned in `scripts/cards/extract-logos.mjs`, CC0-1.0) does contain an `sap.svg` icon (`siSap`, brand colour `0FAAFF`, source https://www.sap.com). Its data carries **no licence and no brand-guidelines link**, and the Simple Icons disclaimer says CC0 for the package does not imply CC0 for each icon and that users must seek the brand's permission.
- Devicon 2.18.0 (MIT) has no SAP, ABAP or HANA icon.
- SAP's trademark page (https://www.sap.com/about/legal/trademark.html, effective 2026-01-12) states: "SAP logos can only be used with specific written permission from SAP", and that third parties cannot use the SAP logo. No such permission exists.

So the key `si:sap` is not added to `logos.json`. The ERP and SAP cards use a white-line glyph in the style of the existing `gl:` glyphs (for example a stack of three layers or a ledger sheet), and the card text names the product only as plain text. ABAP is a registered SAP trademark too; the ABAP card uses a glyph or the generic code mark, never an SAP mark.
