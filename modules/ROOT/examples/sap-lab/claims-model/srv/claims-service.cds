using { sap.guide.claimsmodel as db } from '../db/schema';

service ClaimsService {
  entity Claims     as projection on db.Claims;
  entity Categories as projection on db.Categories;

  // tag::action[]
  extend entity Claims with actions {
    action submit() returns Claims;
  }
  // end::action[]
}
