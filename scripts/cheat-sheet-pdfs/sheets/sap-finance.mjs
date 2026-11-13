// SAP Finance cheat sheet content, from modules/ROOT/pages/erp/sap/finance/cheat-sheet.adoc (releases from the
// `== Version baseline` of modules/ROOT/pages/erp/sap/finance/index.adoc).
export default {
  file: 'sap-finance-cheat-sheet.pdf',
  title: 'SAP Finance Cheat Sheet',
  subtitle: 'SAP S/4HANA 2025 FPS02 · Cloud Public Edition 2608 · AI-generated summary — verify against help.sap.com · see the SAP Finance pages for details',
  footer: 'Irurueta Docs · SAP Finance · running example Example Trading Co. (EX01): all codes and amounts are examples',
  boxes: [
    {
      title: 'ORGANIZATIONAL UNITS',
      color: 'indigo',
      items: [
        { label: 'Running example', code: [
          'Company code     EX01 (EUR, group GBP)',
          'Ledgers          0L leading, 2L local',
          'Controlling area EX00',
          'Cost center      EX-ADM',
          'Profit centers   EX-RETAIL, EX-WHOLE',
          'Segments         RETAIL, WHOLESALE',
        ].join('\n') },
        { label: 'Rules', text: 'n company codes : 1 controlling area (same operational chart of accounts). n profit centers : 1 controlling area. n profit centers : 1 segment. Business area is legacy.' },
      ],
    },
    {
      title: 'CHARTS, G/L, PERIODS',
      color: 'cyan',
      items: [
        { label: 'Charts of accounts', code: [
          'YCOA  operating (EX01 assigned)',
          'YLOC  country, YGRP  group',
          '400000 Sales revenue, domestic',
        ].join('\n') },
        { label: 'Master data', code: [
          'On premise: FS00, FSP0, FSS0',
          'Apps: F0731A accounts, F0763A chart',
        ].join('\n') },
        { label: 'Fiscal year variants', code: [
          'K4  calendar year, 12 + 4 special',
          'V6  July to June, SZ  template',
          'Posting periods: F2293, OB52',
          'Fiscal year period: 2026013',
        ].join('\n') },
      ],
    },
    {
      title: 'UNIVERSAL JOURNAL',
      color: 'green',
      items: [
        { label: 'Tables and view', code: [
          'ACDOCA  all line items (no primary key)',
          'BKPF    header, BSEG  source/open items',
          'Absorbed: FAGLFLEXA, COEP, ANEP, MLIT',
          'Read with CDS view I_JournalEntryItem',
          'Compatibility views: BSIS, BSID, BSIK',
        ].join('\n') },
        { label: 'Custom fields', code: [
          'OXK3 + CI_COBL (coding block)',
          'SCFD_EUI enables Custom Fields app',
          'KEA5 for CO-PA characteristics',
        ].join('\n') },
      ],
    },
    {
      title: 'LEDGERS AND CURRENCIES',
      color: 'teal',
      items: [
        { label: 'Currency types', code: [
          '00 document   10 company code',
          '20 controlling area   30 group',
          '40 hard   50 index-based',
        ].join('\n') },
        { label: 'Rate 0.85 GBP for 1 EUR', code: [
          '10,000.00 EUR x 0.85 =  8,500.00 GBP',
          '   240.00 EUR x 0.85 =    204.00 GBP',
        ].join('\n') },
        { label: 'Ledger kinds', text: 'Leading 0L (feeds Controlling), non-leading, extension and day ledger. A ledger group addresses several ledgers at once.' },
      ],
    },
    {
      title: 'DOCUMENTS AND POSTING KEYS',
      color: 'orange',
      items: [
        { label: 'Document types', code: [
          'SA G/L   AB general   CO from CO',
          'KR vendor invoice   KG credit memo',
          'KZ vendor payment   KN net',
          'DR customer invoice DG credit memo',
          'DZ customer payment',
        ].join('\n') },
        { label: 'Posting keys', code: [
          '40 debit G/L    50 credit G/L',
          '01 / 11 customer invoice / credit',
          '31 / 21 vendor invoice / credit',
          '25 vendor payment',
          'Special G/L: 09 19 29 39',
        ].join('\n') },
        { label: 'Example, balanced in both currencies', code: [
          '40 Office supplies  240.00 EUR 204.00 GBP',
          '50 Petty cash       240.00 EUR 204.00 GBP',
        ].join('\n') },
      ],
    },
    {
      title: 'PAYABLES, RECEIVABLES, PAYMENT',
      color: 'pink',
      items: [
        { label: 'Transactions and apps', code: [
          'Supplier invoice  FB60, MIRO; F0859',
          'Customer invoice  FB70',
          'Pay supplier      F-53, F-48; F1612',
          'Line items  FBL1N F0712, FBL5N F0711',
          'Payment run  F110; F0770, F0771, F1868',
          'Blocks F0593A, dunning F2435, credit F4596',
        ].join('\n') },
        { label: 'Payment run example', code: [
          'I1 4,000.00, 2% discount = 80.00',
          'I2 6,000.00; I3 blocked',
          '3,920.00 + 6,000.00 = 9,920.00 EUR',
          '9,920.00 x 0.85 = 8,432.00 GBP',
        ].join('\n') },
      ],
    },
    {
      title: 'OPEN ITEMS AND CLEARING',
      color: 'yellow',
      items: [
        { label: 'Line items', code: [
          'G/L items  FBL3N, FAGLL03; F2217, F2218',
        ].join('\n') },
        { label: 'Clearing', code: [
          'Manual     F-03, FB1S; F1579',
          'With post  F-04, F-30, FB05',
          'Automatic  F.13; job app F1927',
          'Reset      FBRA',
        ].join('\n') },
        { label: 'Rule', text: 'Only accounts with open item management are cleared; the items of one clearing total zero.' },
      ],
    },
    {
      title: 'ASSETS, BANK AND CASH',
      color: 'slate',
      items: [
        { label: 'Assets', code: [
          'AS01 create, AS02 change, AS03 display',
          'Public Edition: F3425A (F3425 deprecated)',
          'Area 01 local   30 IFRS   35 cost acct',
          'Van 15,000.00 / 5 years = 3,000.00 a year',
          'Invoice 15,300.00 = van 15,000 + 300',
        ].join('\n') },
        { label: 'Bank and cash', code: [
          'FI01 banks, FI12_HBANK house banks',
          'FF_5 upload statement; F1564 statements',
          'F1366A bank accounts, FBCJ cash journal',
          'F1737 / F5380 cash position, F0512',
        ].join('\n') },
      ],
    },
    {
      title: 'CONTROLLING AND ALLOCATIONS',
      color: 'violet',
      items: [
        { label: 'Master data', code: [
          'Cost elements  KA01 KA02 KA03 KA06',
          'Cost center    KS01, KS02; F1443B',
          'Orders settlement F5695, KB21N activity',
        ].join('\n') },
        { label: 'Rent 1,000.00 EUR by floor area', code: [
          'EX-RENT -> EX-ADM    120 m2  200.00',
          '           EX-SALES  180 m2  300.00',
          '           EX-PROD   300 m2  500.00',
        ].join('\n') },
        { label: 'Activity EX-IT, 50.00 EUR per hour', code: [
          'EX-SALES 12 h = 600.00, EX-PROD 8 h = 400.00',
          'EX-IT credited 20 h = 1,000.00 EUR',
        ].join('\n') },
      ],
    },
    {
      title: 'PROFIT CENTERS AND MARGIN',
      color: 'indigo',
      items: [
        { label: 'Document splitting', text: 'Invoice 1,000.00 EUR for profit centers PC-SALES 600.00 and PC-ADMIN 400.00: the payable is split by the cost lines (table T8G16, report FAGL_SHOW_SPLIT).' },
        { label: 'Margin, EX01, 0.85 GBP for 1 EUR', code: [
          'Revenue PG-A 8,000 + PG-B 4,000 = 12,000',
          'After COGS            5,000.00 EUR',
          'After packing, freight 3,500.00 EUR',
          '3,500.00 x 0.85 = 2,975.00 GBP',
        ].join('\n') },
      ],
    },
    {
      title: 'PERIOD END AND TAX',
      color: 'green',
      items: [
        { label: 'Closing', code: [
          'Valuation  FAGL_FCV (F.05 classic)',
          'Regroup    SAPF100',
          'Cockpit    FCLOCOC, FCLOCOT',
        ].join('\n') },
        { label: 'Valuation at 0.80', code: [
          'GBP 8,500.00 receivable: 10,000 -> 10,625',
          'Gain 625.00; GBP 4,250 payable: loss 312.50',
        ].join('\n') },
        { label: 'Tax', code: [
          'Codes S0 S1 J9 I9 V2; maintain FTXP',
          'Condition access sequence MWST',
          'US: condition UTXJ, procedure TAXUSJ',
          'CDS view I_TaxCode',
        ].join('\n') },
      ],
    },
    {
      title: 'APIS AND BAPIS',
      color: 'pink',
      items: [
        { label: 'SOAP post', code: [
          'JournalEntryCreateRequestConfirmation_In',
          'JournalEntryBulkCreationRequest_In (bulk)',
        ].join('\n') },
        { label: 'OData read', code: [
          'API_JOURNALENTRYITEMBASIC_SRV',
          'API_COSTCENTER_SRV, API_PROFITCENTER_SRV',
          '/A_JournalEntryItemBasic/?$top=2',
        ].join('\n') },
        { label: 'ABAP BAPI', code: [
          'BAPI_ACC_DOCUMENT_CHECK, then _POST',
          'DOCUMENTHEADER, ACCOUNTGL, CURRENCYAMOUNT',
          'ITEMNO_ACC links line and amount, RETURN',
          'BAPI_TRANSACTION_COMMIT or _ROLLBACK',
        ].join('\n') },
      ],
    },
  ],
};
