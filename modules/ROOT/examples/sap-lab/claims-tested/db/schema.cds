using { cuid, managed } from '@sap/cds/common';
namespace sap.guide.tested;
entity Claims : cuid, managed {
  title  : String(80);
  status : String(1) default 'N';
  amount : Decimal(9,2);
}
