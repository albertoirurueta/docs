using { cuid } from '@sap/cds/common';
namespace sap.guide.costalloc;

// A teaching model of cost allocation, not SAP S/4HANA. CostCenter, GLAccount,
// CompanyCode, FiscalPeriod and AmountInCompanyCodeCurrency are element names
// of the SAP view I_JournalEntryItemBasic; the other names are our own.
entity CostCenters {
  key CostCenter : String(10);
  Name           : String(40);
}

// Category 1 is a primary cost element, 42 an assessment account. Balance sheet
// accounts have no category.
entity GLAccounts {
  key GLAccount       : String(10);
  Name                : String(40);
  CostElementCategory : String(2);
}

// A statistical key figure (here: floor area) is a number, not an amount. It is
// the tracing factor that decides how much of a cost each receiver gets.
entity KeyFigures {
  key CostCenter : String(10);
  key KeyFigure  : String(10);
  key FiscalYear : String(4);
  Value          : Decimal(13,3);
  Unit           : String(3);
}

// One line of the journal. A debit is a positive amount and a credit a
// negative amount, so the lines of a balanced posting add up to zero.
entity JournalLines : cuid {
  CompanyCode                 : String(4) default 'EX01';
  Document                    : String(30);
  PostingDate                 : Date;
  FiscalYear                  : String(4);
  FiscalPeriod                : String(3);
  GLAccount                   : String(10);
  CostCenter                  : String(10);
  AmountInCompanyCodeCurrency : Decimal(15,2);
  Text                        : String(60);
  Source                      : String(10) default 'POSTING';
}

// tag::cycle[]
// An allocation cycle: the sender, the rule and the receivers.
entity AllocationCycles {
  key Cycle        : String(10);
  Description      : String(60);
  AllocationType   : String(12) default 'ASSESSMENT';
  SenderCostCenter : String(10);
  SenderAccount    : String(10);
  SenderShare      : Decimal(5,2) default 100;
  OverheadAccount  : String(10) default '940000';
  KeyFigure        : String(10);
  FactorPer        : Integer default 1;
  Receivers : Composition of many AllocationReceivers on Receivers.Cycle = $self;
}

entity AllocationReceivers : cuid {
  Cycle      : Association to AllocationCycles;
  CostCenter : String(10);
  Factor     : Decimal(9,3) default 1;
}
// end::cycle[]
