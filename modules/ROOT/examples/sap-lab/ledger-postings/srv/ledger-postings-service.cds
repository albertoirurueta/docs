using { sap.guide.ledgerpostings as db } from '../db/schema';

service LedgerPostingsService {
  @readonly entity Documents     as projection on db.Documents;
  @readonly @cds.redirection.target
  entity DocumentItems as projection on db.DocumentItems;
  @readonly entity GLAccounts    as projection on db.GLAccounts;
  @readonly entity Materials     as projection on db.Materials;
  @readonly entity PurchaseOrders as projection on db.PurchaseOrders;
  @readonly entity AccountDetermination
    as projection on db.AccountDetermination;

  // Debits, credits and balance of every account (a debit balance is positive).
  @readonly entity AccountBalances as select from db.DocumentItems {
    key GLAccount,
    sum(case when AmountInCompanyCodeCurrency > 0
        then AmountInCompanyCodeCurrency else 0 end) as Debits  : Decimal(15,2),
    sum(case when AmountInCompanyCodeCurrency < 0
        then -AmountInCompanyCodeCurrency else 0 end) as Credits : Decimal(15,2),
    sum(AmountInCompanyCodeCurrency) as Balance : Decimal(15,2)
  } group by GLAccount;

  // The lines of open-item-managed accounts that are not cleared yet.
  @readonly entity OpenItems as select from db.DocumentItems as i
    inner join db.GLAccounts as a on a.Account = i.GLAccount {
    key i.Document.DocumentNumber as DocumentNumber, key i.ItemNumber,
    i.GLAccount, i.Partner, i.Reference, i.AmountInCompanyCodeCurrency
  } where i.ClearingDocument is null and a.OpenItemManaged = true;

  type Cleared { ClearingDocument : String(10); ClearedItems : Integer; }

  action postGoodsReceipt(PurchaseOrder : String(10), Quantity : Integer,
    PostingDate : Date) returns Documents;
  action postInvoiceReceipt(PurchaseOrder : String(10), Quantity : Integer,
    InvoicePrice : Decimal(15,2), PostingDate : Date) returns Documents;
  action payVendor(Document : String(10), PostingDate : Date)
    returns Documents;
  action postSale(Material : String(10), Quantity : Integer,
    NetPrice : Decimal(15,2), Customer : String(10), PostingDate : Date,
    ProfitCenter : String(10)) returns Documents;
  action receiveCustomerPayment(Customer : String(10), Amount : Decimal(15,2),
    PostingDate : Date) returns Documents;
  action clearOpenItems(GLAccount : String(10), Partner : String(10),
    Reference : String(20), ClearingDate : Date) returns Cleared;
}
