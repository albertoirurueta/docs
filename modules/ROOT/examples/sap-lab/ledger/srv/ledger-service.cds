using { sap.guide.ledger as db } from '../db/schema';
service LedgerService {
  entity JournalEntries     as projection on db.JournalEntries;
  entity JournalEntryItems  as projection on db.JournalEntryItems;
  @readonly
  entity PostingPeriods     as projection on db.PostingPeriods;
}
