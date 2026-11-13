using { cuid, managed } from '@sap/cds/common';
namespace sap.guide.ledger;

// A teaching model of a journal entry, not SAP S/4HANA. CompanyCode, Ledger,
// GLAccount, CompanyCodeCurrency and AmountInCompanyCodeCurrency are element
// names of the SAP view I_JournalEntryItemBasic; the other names are our own.
entity JournalEntries : cuid, managed {
  CompanyCode         : String(4) default 'EX01';
  Ledger              : String(2) default '0L';
  PostingDate         : Date;
  FiscalYear          : String(4);
  FiscalPeriod        : String(3);
  Description         : String(60);
  CompanyCodeCurrency : String(3) default 'EUR';
  Items : Composition of many JournalEntryItems on Items.Entry = $self;
}

// One line of an entry. A debit is a positive amount and a credit a negative
// amount (our own convention), so a balanced entry adds up to zero.
entity JournalEntryItems : cuid {
  Entry                       : Association to JournalEntries;
  GLAccount                   : String(10);
  ProfitCenter                : String(10);
  AmountInCompanyCodeCurrency : Decimal(15,2);
}

// Which posting periods are open for a company code. The model uses the
// calendar year as the fiscal year, with 12 monthly periods.
entity PostingPeriods {
  key CompanyCode  : String(4);
  key FiscalYear   : String(4);
  key FiscalPeriod : String(3);
  Open             : Boolean;
}
