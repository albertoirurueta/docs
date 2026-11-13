// Figures of "SAP Guide: Add a Fiori Elements App to a CAP Service" (erp/sap/guide-cap-fiori-elements-app.adoc). Facts: the lab
// project modules/ROOT/examples/sap-lab/expenses run with `cds watch` (CAP 10.2.2) and its Fiori elements preview in a browser on
// 2026-11-13 (SAPUI5 1.145.0 loaded by the preview, English through sap-language=EN): list report with filter bar, object page
// with the tabs General and Administration, the draft (Draft marker, Header tab, footer with Save and Discard Draft), the value
// help dialog "Select: Status" and the footer button Create of a new claim. The code shown is the lab's annotation file. The
// step numbers are the callout numbers of the page. Colours are theme tokens only.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FW, mark, vscodeShell, fioriShell, fioriListReport, fioriObjectPage, fioriValueHelp, cdsCode, labText } from '../lib/sap-shells.mjs';

const lab = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'modules', 'ROOT', 'examples', 'sap-lab', 'expenses');
const annotations = readFileSync(join(lab, 'app', 'annotations.cds'), 'utf8');
const firstSteps = `${labText(annotations, { lines: [1, 1] })}\n\n${labText(annotations, { only: ['labels'] })}`;

function vscode() {
  const explorer = [
    { label: 'EXPENSES', folder: true, open: true },
    { label: 'app', indent: 1, folder: true, open: true },
    { label: 'annotations.cds', indent: 2, active: true },
    { label: 'db', indent: 1, folder: true },
    { label: 'srv', indent: 1, folder: true, open: true },
    { label: 'expense-service.cds', indent: 2 },
    { label: 'package.json', indent: 1 },
  ];
  const h = 340;
  const sh = vscodeShell({ h, title: 'expenses', explorer, tabs: ['expense-service.cds', 'annotations.cds'], activeTab: 1, code: cdsCode(firstSteps) });
  const g = sh.geo;
  const list = [...mark(g['entry:expense-service.cds'], 1), ...mark(g['entry:annotations.cds'], 2)];
  return {
    id: '01-draft-and-labels', width: FW, height: h, theme: 'vscode',
    alt: 'Visual Studio Code with the expenses project: the explorer lists app/annotations.cds and srv/expense-service.cds, the editor shows annotations.cds with the line that imports ExpenseService and the annotation that gives the fields title, status and amount their labels; callout 1 marks the service file and callout 2 marks the annotation file',
    nodes: sh.nodes.map((nd) => ({ ...nd, children: [...nd.children, ...list] })),
  };
}

function fiori({ id, alt, title, back, scene, marksFor, extra = [] }) {
  const sc = scene();
  const h = sc.height;
  const list = marksFor(sc.geo).flatMap(([b, n]) => mark(b, n));
  return { id, alt, width: FW, height: h, theme: 'sap-fiori', nodes: fioriShell({ h, title, back, children: [...sc.nodes, ...extra.map((f) => f(sc)).flat(), ...list] }) };
}

const rowsFirst = [['Train ticket', 'N', '45.50']];

export default {
  area: 'general',
  theme: 'sap-fiori',
  guide: 'cap-fiori-elements-app',
  figures: [
    vscode(),
    fiori({
      id: '02-list-report', title: 'Preview – List of ExpenseService.Claims', scene: () => fioriListReport({ rows: rowsFirst }),
      alt: 'Fiori elements list report of the Claims preview: the shell bar title is marked by callout 5 and the table with the columns Title, Status and Amount, which come from the line item annotation, is marked by callout 3; one claim, Train ticket with status N and amount 45.50, is listed',
      marksFor: (g) => [[{ x: 24, y: g.tableTop + 52, w: FW - 48, h: 44 }, 3], [{ x: 56, y: 14, w: 420, h: 24 }, 5]],
    }),
    fiori({
      id: '03-object-page', title: 'Claim', back: true, scene: () => fioriObjectPage(),
      alt: 'Fiori elements object page of the claim Train ticket: the header title is marked by callout 6, the tabs General and Administration by callout 7, and the General section with the fields Title, Status and Amount by callout 8; Edit and Delete are in the header',
      marksFor: (g) => [[{ x: 16, y: 52 + 14, w: 220, h: 36 }, 6], [g.tabs, 7], [g.general, 8]],
    }),
    fiori({
      id: '04-edit-draft', title: 'Claim', back: true, scene: () => fioriObjectPage({ mode: 'edit', amount: '50.00', footerNote: 'Draft updated' }),
      alt: 'Fiori elements object page of the claim in edit mode: next to the title the marker Draft is marked by callout 9, an extra Header tab and section appear, the Amount field holds 50.00 and the footer shows Draft updated with the buttons Save, marked by callout 10, and Discard Draft',
      marksFor: (g) => [[g.draft, 9], [g.save, 10]],
    }),
    fiori({
      id: '05-value-help', title: 'Claim', back: true, scene: () => fioriObjectPage({ mode: 'edit', footerNote: 'Draft updated' }),
      extra: [() => fioriValueHelp({ rows: [['A', 'Approved'], ['N', 'New'], ['P', 'Paid'], ['R', 'Rejected']] }).nodes],
      alt: 'The value help dialog Select: Status over the claim in edit mode: a search field with Go and Show Filters, then Items (4) with the codes and names A Approved, N New, P Paid and R Rejected, and a Cancel button; callout 14 marks the row Approved',
      marksFor: () => [[{ x: 144, y: 70 + 168, w: FW - 288, h: 36 }, 14]],
    }),
    fiori({
      id: '06-create-claim', title: 'Claim', back: true, scene: () => fioriObjectPage({ mode: 'create', title: 'Taxi', amount: '18.00', footerNote: 'Draft updated' }),
      alt: 'Fiori elements object page for a new claim titled Taxi with the status N and the amount 18.00; the footer shows Draft updated with the buttons Create, marked by callout 15, and Discard Draft',
      marksFor: (g) => [[g.save, 15]],
    }),
    fiori({
      id: '07-result', title: 'Preview – List of ExpenseService.Claims', scene: () => fioriListReport({ rows: [['Train ticket', 'A', '50.00'], ['Taxi', 'N', '18.00']] }),
      alt: 'Fiori elements list report with two claims: Train ticket with the status A and the amount 50.00, and Taxi with the status N and the amount 18.00',
      marksFor: () => [],
    }),
  ],
};
