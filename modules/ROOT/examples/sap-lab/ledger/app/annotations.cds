using LedgerService as service from '../srv/ledger-service';

// tag::labels[]
annotate service.JournalEntries with {
  PostingDate         @title : 'Posting Date';
  Description         @title : 'Description';
  CompanyCode         @title : 'Company Code';
  Ledger              @title : 'Ledger';
  FiscalYear          @title : 'Fiscal Year';
  FiscalPeriod        @title : 'Fiscal Period';
  CompanyCodeCurrency @title : 'Currency';
};
annotate service.JournalEntryItems with {
  GLAccount                   @title : 'G/L Account';
  ProfitCenter                @title : 'Profit Center';
  AmountInCompanyCodeCurrency @title : 'Amount in Company Code Currency';
};
// end::labels[]

// tag::entries[]
annotate service.JournalEntries with @(
  UI.LineItem : [
    { Value : PostingDate },
    { Value : Description },
    { Value : CompanyCode },
    { Value : FiscalYear },
    { Value : FiscalPeriod }
  ],
  UI.HeaderInfo : { TypeName : 'Journal Entry', TypeNamePlural : 'Journal Entries', Title : { Value : Description } },
  UI.Facets : [
    { $Type : 'UI.ReferenceFacet', Label : 'General', Target : '@UI.FieldGroup#General' },
    { $Type : 'UI.ReferenceFacet', Label : 'Lines', Target : 'Items/@UI.LineItem' }
  ],
  UI.FieldGroup #General : { Data : [{ Value : CompanyCode }, { Value : Ledger }, { Value : PostingDate }, { Value : CompanyCodeCurrency }] }
);
annotate service.JournalEntryItems with @(
  UI.LineItem : [{ Value : GLAccount }, { Value : ProfitCenter }, { Value : AmountInCompanyCodeCurrency }]
);
// end::entries[]
