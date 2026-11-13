namespace sap.guide.ledgerpostings;

// A teaching model of postings that follow business events, not SAP S/4HANA.
// CompanyCode, Ledger, GLAccount and AmountInCompanyCodeCurrency are element
// names of the SAP view I_JournalEntryItemBasic; the other names are our own.
entity GLAccounts {
  key Account     : String(10);
  Name            : String(40);
  OpenItemManaged : Boolean;
}

// Which G/L account a transaction key posts to. ValuationClass is '-' for a
// key that does not depend on it (our own convention).
entity AccountDetermination {
  key TransactionKey : String(10);
  key ValuationClass : String(4);
  GLAccount          : String(10);
}

entity Materials {
  key ID         : String(10);
  Name           : String(40);
  ValuationClass : String(4);
  StandardPrice  : Decimal(15,2);
  StockQuantity  : Integer default 0;
}

entity PurchaseOrders {
  key ID           : String(10);
  Supplier         : String(10);
  Material         : Association to Materials;
  Quantity         : Integer;
  Price            : Decimal(15,2);
  ReceivedQuantity : Integer default 0;
  InvoicedQuantity : Integer default 0;
}

// An accounting document: the posting of one business event.
entity Documents {
  key DocumentNumber : String(10);
  DocumentType       : String(2);
  CompanyCode        : String(4) default 'EX01';
  Ledger             : String(2) default '0L';
  PostingDate        : Date;
  Description        : String(60);
  Items : Composition of many DocumentItems on Items.Document = $self;
}

// One line. A debit is a positive amount and a credit a negative amount.
// A line of an open-item-managed account is open until it is cleared.
entity DocumentItems {
  key Document                : Association to Documents;
  key ItemNumber              : Integer;
  TransactionKey              : String(10);
  GLAccount                   : String(10);
  ProfitCenter                : String(10);
  Partner                     : String(10);
  Reference                   : String(20);
  AmountInCompanyCodeCurrency : Decimal(15,2);
  ClearingDocument            : String(10);
  ClearingDate                : Date;
}
