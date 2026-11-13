using { sap.guide.secured as db } from '../db/schema';

service ClaimsService {
  entity Claims as projection on db.Claims actions {
    action approve();
  };
}
