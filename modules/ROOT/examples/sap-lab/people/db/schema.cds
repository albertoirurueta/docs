namespace sap.guide.people;

// A teaching model of infotype-style employee records, not SAP S/4HANA and not
// SAP SuccessFactors. Names, numbers and dates are invented example values.
entity Employees {
  key PersonnelNumber : String(8);
  Name                : String(40);
  EntryDate           : Date;
  OrgAssignments      : Composition of many OrganizationalAssignments
                          on OrgAssignments.Employee = $self;
  BasicPay            : Composition of many BasicPayRecords
                          on BasicPay.Employee = $self;
  ParkingPermits      : Composition of many ParkingPermits
                          on ParkingPermits.Employee = $self;
}

// Time constraint 1: exactly one record is valid at any time.
entity OrganizationalAssignments {
  key Employee      : Association to Employees;
  key BeginDate     : Date;
  EndDate           : Date default '9999-12-31';
  PersonnelArea     : String(4);
  PersonnelSubarea  : String(4);
  EmployeeGroup     : String(1);
  EmployeeSubgroup  : String(2);
  Position          : String(8);
  PayrollArea       : String(2);
}

// Time constraint 1 as well.
entity BasicPayRecords {
  key Employee  : Association to Employees;
  key BeginDate : Date;
  EndDate       : Date default '9999-12-31';
  PayBasis      : String(10);
  Amount        : Decimal(9,2);
  Currency      : String(3) default 'EUR';
}

// Time constraint 2: at most one record is valid at any time; gaps are allowed.
// A record of the model's own, not an SAP infotype.
entity ParkingPermits {
  key Employee  : Association to Employees;
  key BeginDate : Date;
  EndDate       : Date default '9999-12-31';
  Permit        : String(10);
}
