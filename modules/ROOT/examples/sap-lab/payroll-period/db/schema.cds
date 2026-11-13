namespace sap.guide.payroll;

// A teaching model of one payroll calculation, not SAP S/4HANA, not SAP HCM and
// not SAP Payroll. Names, rates, numbers and dates are invented example values.
entity PayrollAreas {
  key Code           : String(2);
  Text               : String(40);
  GeneralWorkingDays : Integer; // the divisor of the payment and deduction methods
}

entity Employees {
  key PersonnelNumber : String(8);
  Name                : String(40);
  PayrollArea         : String(2);
  MonthlyBasicPay     : Decimal(9,2);
}

// Flat example rates, not the rules of any country. Percent 20.00 is 20 percent.
entity Rates {
  key Code : String(10);
  Text     : String(40);
  Percent  : Decimal(5,2);
}

// Unpaid leave of an employee, from the first to the last day (both inclusive).
entity Absences {
  key Employee  : Association to Employees;
  key BeginDate : Date;
  EndDate       : Date;
  Kind          : String(20);
}

// A fixed amount taken from the net pay each month. An invented example.
entity VoluntaryDeductions {
  key Employee : Association to Employees;
  key Code     : String(10);
  Text         : String(40);
  Amount       : Decimal(9,2);
}

// One calculated payslip, a snapshot: the name and the numbers stay as they were.
entity Payslips {
  key Number      : Integer;
  PersonnelNumber : String(8);
  EmployeeName    : String(40);
  Period         : String(7);   // YYYY-MM
  FromDate       : Date;        // first day paid inside the period
  ToDate         : Date;        // last day paid inside the period
  Method         : String(10);  // PWS, PAYMENT or DEDUCTION
  PlannedDays    : Integer;
  AbsentDays     : Integer;
  DivisorDays    : Integer;
  Numerator      : Integer;
  Factor         : Decimal(7,4);
  BasicPay       : Decimal(9,2);
  GrossPay       : Decimal(9,2);
  SocialEmployee : Decimal(9,2);
  IncomeTax      : Decimal(9,2);
  NetPay         : Decimal(9,2);
  Voluntary      : Decimal(9,2);
  Payment        : Decimal(9,2);
  SocialEmployer : Decimal(9,2);
  EmployerCost   : Decimal(9,2);
  Lines          : Composition of many PayslipLines on Lines.Payslip = $self;
}

entity PayslipLines {
  key Payslip : Association to Payslips;
  key Position : Integer;
  Text         : String(60);
  Basis        : String(60);
  Amount       : Decimal(9,2);
}
