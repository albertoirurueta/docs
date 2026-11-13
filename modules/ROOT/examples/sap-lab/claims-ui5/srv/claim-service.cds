using { sap.guide.claims as db } from '../db/schema';

service ClaimService {
  entity Claims as projection on db.Claims;
}
