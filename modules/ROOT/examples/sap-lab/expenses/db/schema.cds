using { cuid, managed } from '@sap/cds/common';
namespace sap.guide.expenses;
entity Claims : cuid, managed {
  title  : String(80);
  status : String(1) default 'N';
  amount : Decimal(9,2);
}
// tag::statuses[]
entity Statuses {
  key code : String(1);
  name     : String(20);
}
// end::statuses[]
