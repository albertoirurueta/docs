using { cuid, managed } from '@sap/cds/common';
namespace sap.guide.claimsmodel;

entity Categories {
  key code : String(10);
  name     : String(40);
}

entity Claims : cuid, managed {
  title  : String(80);
  status : String(1) default 'N';
  total  : Decimal(9,2);
  items  : Composition of many ClaimItems on items.claim = $self;
}

entity ClaimItems : cuid {
  claim       : Association to Claims;
  category    : Association to Categories @assert.target;
  description : String(80);
  amount      : Decimal(9,2);
}
