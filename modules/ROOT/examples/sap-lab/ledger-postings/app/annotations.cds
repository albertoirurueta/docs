using LedgerPostingsService as service from '../srv/ledger-postings-service';

// tag::labels[]
annotate service.Documents with {
  DocumentNumber @title : 'Document Number';
  DocumentType   @title : 'Type';
  PostingDate    @title : 'Posting Date';
  Description    @title : 'Description';
  CompanyCode    @title : 'Company Code';
  Ledger         @title : 'Ledger';
};
annotate service.DocumentItems with {
  ItemNumber                  @title : 'Item';
  TransactionKey              @title : 'Key';
  GLAccount                   @title : 'G/L Account';
  ProfitCenter                @title : 'Profit Center';
  Partner                     @title : 'Partner';
  Reference                   @title : 'Reference';
  AmountInCompanyCodeCurrency @title : 'Amount in Company Code Currency';
  ClearingDocument            @title : 'Clearing Document';
};
// end::labels[]

// tag::documents[]
annotate service.Documents with @(
  UI.LineItem : [
    { Value : DocumentNumber },
    { Value : DocumentType },
    { Value : PostingDate },
    { Value : Description },
    { Value : CompanyCode }
  ],
  UI.HeaderInfo : {
    TypeName : 'Document', TypeNamePlural : 'Documents',
    Title : { Value : Description }
  },
  UI.Facets : [
    { $Type : 'UI.ReferenceFacet', Label : 'General', Target : '@UI.FieldGroup#General' },
    { $Type : 'UI.ReferenceFacet', Label : 'Lines', Target : 'Items/@UI.LineItem' }
  ],
  UI.FieldGroup #General : {
    Data : [{ Value : DocumentNumber }, { Value : PostingDate },
            { Value : CompanyCode }, { Value : Ledger }]
  }
);
annotate service.DocumentItems with @(
  UI.LineItem : [
    { Value : ItemNumber }, { Value : TransactionKey }, { Value : GLAccount },
    { Value : AmountInCompanyCodeCurrency }, { Value : ClearingDocument }
  ]
);
// end::documents[]
