using { sap.guide.expenses as db } from '../db/schema';
service ExpenseService {
  // tag::draft[]
  @odata.draft.enabled
  // end::draft[]
  entity Claims as projection on db.Claims;
  // tag::statuses[]
  @readonly
  entity Statuses as projection on db.Statuses;
  // end::statuses[]
}
