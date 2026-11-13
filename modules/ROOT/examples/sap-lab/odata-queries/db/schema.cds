namespace sap.guide.queries;

entity Claims {
  key ID    : Integer;
  title     : String(80);
  status    : String(1) default 'N';
  amount    : Decimal(9,2);
  claimDate : Date;
  items     : Composition of many Items on items.claim = $self;
}

entity Items {
  key ID   : Integer;
  claim    : Association to Claims;
  category : String(20);
  amount   : Decimal(9,2);
}
