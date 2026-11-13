using { sap.guide.costalloc as db } from '../db/schema';

service AllocationService {
  @readonly entity CostCenters as projection on db.CostCenters;
  @readonly entity GLAccounts  as projection on db.GLAccounts;
  entity KeyFigures            as projection on db.KeyFigures;
  entity AllocationCycles      as projection on db.AllocationCycles;
  entity AllocationReceivers   as projection on db.AllocationReceivers;
  entity JournalLines          as projection on db.JournalLines;

  // The balance of every cost center on every account, added up from the lines.
  @readonly entity CostCenterBalances as select from db.JournalLines {
    key CostCenter,
    key GLAccount,
    sum(AmountInCompanyCodeCurrency) as Balance : Decimal(15,2)
  } where CostCenter is not null group by CostCenter, GLAccount;

  // tag::actions[]
  type RunLine {
    CostCenter : String(10);
    GLAccount  : String(10);
    Amount     : Decimal(15,2);
  }
  type RunResult {
    Cycle        : String(10);
    PostingDate  : Date;
    Released     : Decimal(15,2);
    Lines        : many RunLine;
  }
  action runAllocation(Cycle : String(10), FiscalYear : String(4),
                       FiscalPeriod : String(3)) returns RunResult;

  type TrialBalanceRow {
    GLAccount       : String(10);
    Name            : String(40);
    StartingBalance : Decimal(15,2);
    Debits          : Decimal(15,2);
    Credits         : Decimal(15,2);
    EndingBalance   : Decimal(15,2);
  }
  type TrialBalanceResult {
    Rows                 : many TrialBalanceRow;
    TotalStartingBalance : Decimal(15,2);
    TotalDebits          : Decimal(15,2);
    TotalCredits         : Decimal(15,2);
    TotalEndingBalance   : Decimal(15,2);
    Balanced             : Boolean;
  }
  function trialBalance(FromPostingDate : Date, ToPostingDate : Date)
    returns TrialBalanceResult;
  // end::actions[]
}
