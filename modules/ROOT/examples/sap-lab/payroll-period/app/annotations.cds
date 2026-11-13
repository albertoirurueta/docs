using PayrollService as service from '../srv/payroll-service';

// tag::labels[]
annotate service.Payslips with {
  Number          @title : 'Payslip';
  PersonnelNumber @title : 'Personnel Number';
  EmployeeName    @title : 'Name';
  Period          @title : 'Period';
  FromDate        @title : 'Paid From';
  ToDate          @title : 'Paid To';
  Method          @title : 'Method';
  PlannedDays     @title : 'Planned Days';
  AbsentDays      @title : 'Days Not Paid';
  DivisorDays     @title : 'Divisor Days';
  Numerator       @title : 'Numerator';
  Factor          @title : 'Partial Period Factor';
  BasicPay        @title : 'Basic Pay';
  GrossPay        @title : 'Gross Pay';
  NetPay          @title : 'Net Pay';
  Payment         @title : 'Payment';
};
annotate service.PayslipLines with {
  Position @title : 'No.';
  Text     @title : 'Line';
  Basis    @title : 'Basis';
  Amount   @title : 'Amount (EUR)';
};
// end::labels[]

// tag::payslip[]
annotate service.Payslips with @(
  UI.LineItem : [
    { Value : Number }, { Value : EmployeeName }, { Value : Period },
    { Value : Method }, { Value : Factor, Label : 'Factor' }, { Value : GrossPay },
    { Value : NetPay }, { Value : Payment }
  ],
  UI.HeaderInfo : { TypeName : 'Payslip', TypeNamePlural : 'Payslips',
    Title : { Value : EmployeeName } },
  UI.Facets : [
    { $Type : 'UI.ReferenceFacet', Label : 'Calculation', Target : '@UI.FieldGroup#Calculation' },
    { $Type : 'UI.ReferenceFacet', Label : 'Payslip', Target : 'Lines/@UI.LineItem' }
  ],
  UI.FieldGroup #Calculation : { Data : [
    { Value : Period }, { Value : FromDate }, { Value : ToDate },
    { Value : Method }, { Value : PlannedDays }, { Value : AbsentDays },
    { Value : DivisorDays }, { Value : Numerator }, { Value : Factor }
  ] }
);
annotate service.PayslipLines with @(
  UI.LineItem : [
    { Value : Position }, { Value : Text }, { Value : Basis }, { Value : Amount }
  ]
);
// end::payslip[]
