using { sap.guide.tested as db } from '../db/schema';
service ClaimService {
  entity Claims as projection on db.Claims;
}
