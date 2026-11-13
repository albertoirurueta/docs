using { sap.guide.queries as db } from '../db/schema';

service QueryService {
  entity Claims as projection on db.Claims;
  entity Items  as projection on db.Items;
}
