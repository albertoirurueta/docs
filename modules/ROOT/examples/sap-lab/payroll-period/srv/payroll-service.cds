using { sap.guide.payroll as db } from '../db/schema';

service PayrollService {
  @readonly entity PayrollAreas        as projection on db.PayrollAreas;
  @readonly entity Employees           as projection on db.Employees;
  @readonly entity Rates               as projection on db.Rates;
  @readonly entity Absences            as projection on db.Absences;
  @readonly entity VoluntaryDeductions as projection on db.VoluntaryDeductions;
  @readonly entity Payslips            as projection on db.Payslips;
  @readonly entity PayslipLines        as projection on db.PayslipLines;

  // Calculates one payslip and stores it. FromDate and ToDate are optional: the
  // days of the period in which the employee is paid (a hire or a leaving).
  action calculate(PersonnelNumber : String(8), Period : String(7),
                   Method : String(10), FromDate : Date, ToDate : Date)
    returns Payslips;
}
