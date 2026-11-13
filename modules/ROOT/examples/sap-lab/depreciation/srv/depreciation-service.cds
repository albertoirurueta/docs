using { sap.guide.depreciation as db } from '../db/schema';

service DepreciationService {
  @readonly
  entity Assets as projection on db.Assets
    actions {
      function plan() returns many ScheduleLine;
    };

  // One row of a depreciation schedule: the amount of a year, the total so
  // far and the net book value at the end of the year.
  type ScheduleLine {
    Year                    : Integer;
    Depreciation            : Decimal(15,2);
    AccumulatedDepreciation : Decimal(15,2);
    NetBookValue            : Decimal(15,2);
    Rule                    : String(20);
  }

  function calculate(Method : String, Base : Decimal(15,2), Years : Integer,
                     Factor : Decimal(4,2)) returns many ScheduleLine;
}
