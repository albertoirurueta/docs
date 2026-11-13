using { managed } from '@sap/cds/common';
namespace sap.guide.depreciation;

// A teaching model of fixed assets, not SAP S/4HANA. The names are our own.
// The three methods are the ones that the SAP help describes: straight-line
// over the total useful life, straight-line from the net book value over the
// remaining life, and declining balance with a changeover to straight-line.
entity Assets : managed {
  key ID          : String(12);
  Description     : String(60);
  CompanyCode     : String(4) default 'EX01';
  ProfitCenter    : String(10);
  Currency        : String(3) default 'EUR';
  AcquisitionCost : Decimal(15,2);
  UsefulLife      : Integer;
  Method          : String(20);
  Factor          : Decimal(4,2);
}
