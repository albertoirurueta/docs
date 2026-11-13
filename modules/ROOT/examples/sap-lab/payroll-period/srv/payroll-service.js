import cds from '@sap/cds'
import { METHODS, addDays, grossPay, grossToNet, money, partialPeriodFactor,
  periodBounds, toAmount, toCents, workingDays } from './pay.js'

const db = cds.entities('sap.guide.payroll')

export default class PayrollService extends cds.ApplicationService {
  init() {
    // tag::calculate[]
    this.on('calculate', async (req) => {
      const { PersonnelNumber, Method, Period } = req.data
      if (!METHODS.includes(Method)) {
        return req.error(400, `The method must be one of ${METHODS.join(', ')}`)
      }
      if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(Period)) {
        return req.error(400, 'The period must be written YYYY-MM')
      }
      const employee = await SELECT.one.from(db.Employees)
        .where({ PersonnelNumber })
      if (!employee) return req.error(404, `Employee ${PersonnelNumber} not found`)

      const bounds = periodBounds(Period)
      const from = req.data.FromDate ?? bounds.begin
      const to = req.data.ToDate ?? bounds.end
      if (from < bounds.begin || to > bounds.end || from > to) {
        return req.error(400, `The dates must lie inside ${Period}, from before to`)
      }

      // Working days of the period, and the days that are not paid: those
      // outside the paid window and those of unpaid leave inside it.
      const planned = workingDays(bounds.begin, bounds.end)
      let absent = workingDays(bounds.begin, addDays(from, -1)) +
        workingDays(addDays(to, 1), bounds.end)
      const leaves = await SELECT.from(db.Absences)
        .where({ Employee_PersonnelNumber: PersonnelNumber })
      for (const leave of leaves) {
        absent += workingDays(
          leave.BeginDate > from ? leave.BeginDate : from,
          leave.EndDate < to ? leave.EndDate : to)
      }

      const area = await SELECT.one.from(db.PayrollAreas)
        .where({ Code: employee.PayrollArea })
      const { numerator, divisor } =
        partialPeriodFactor(Method, planned, absent, area.GeneralWorkingDays)
      if (numerator < 0) {
        return req.error(400, 'The partial period factor is negative')
      }
    // end::calculate[]

      // tag::money[]
      const basic = toCents(employee.MonthlyBasicPay)
      const gross = grossPay(basic, { numerator, divisor })
      const rate = {}
      for (const r of await SELECT.from(db.Rates)) rate[r.Code] = toCents(r.Percent)
      const voluntaryLines = await SELECT.from(db.VoluntaryDeductions)
        .where({ Employee_PersonnelNumber: PersonnelNumber })
      const voluntary = voluntaryLines.reduce((s, v) => s + toCents(v.Amount), 0)
      const pay = grossToNet(gross,
        { socialEmployee: rate.SOCIAL_EE, incomeTax: rate.TAX,
          socialEmployer: rate.SOCIAL_ER }, voluntary)
      // end::money[]

      // tag::lines[]
      const factorText = (numerator / divisor).toFixed(4)
      const percent = (code) => `${(rate[code] / 100).toFixed(2)}%`
      const lines = [
        ['Basic pay (monthly)', `${money(basic)}`, basic],
        ['Partial period adjustment', `${numerator} / ${divisor} = ${factorText}`,
          gross - basic],
        ['Gross pay', '', gross],
        ['Employee social contributions',
          `${percent('SOCIAL_EE')} of ${money(gross)}`, -pay.socialEmployee],
        ['Income tax', `${percent('TAX')} of ${money(pay.taxable)}`,
          -pay.incomeTax],
        ['Net pay', '', pay.netPay],
        ...voluntaryLines.map((v) => [`Voluntary: ${v.Text}`, 'fixed per month',
          -toCents(v.Amount)]),
        ['Payment', '', pay.payment],
        ['Employer contributions (not on the payslip)',
          `${percent('SOCIAL_ER')} of ${money(gross)}`, pay.socialEmployer]
      ]
      // end::lines[]

      const last = await SELECT.one.from(db.Payslips).columns('max(Number) as n')
      const Number = (last?.n ?? 0) + 1
      await INSERT.into(db.Payslips).entries({
        Number, PersonnelNumber, EmployeeName: employee.Name, Period,
        FromDate: from, ToDate: to, Method, PlannedDays: planned,
        AbsentDays: absent, DivisorDays: divisor, Numerator: numerator,
        Factor: factorText, BasicPay: toAmount(basic), GrossPay: toAmount(gross),
        SocialEmployee: toAmount(pay.socialEmployee),
        IncomeTax: toAmount(pay.incomeTax), NetPay: toAmount(pay.netPay),
        Voluntary: toAmount(voluntary), Payment: toAmount(pay.payment),
        SocialEmployer: toAmount(pay.socialEmployer),
        EmployerCost: toAmount(pay.employerCost),
        Lines: lines.map(([Text, Basis, cents], i) =>
          ({ Position: i + 1, Text, Basis, Amount: toAmount(cents) }))
      })
      return SELECT.one.from(db.Payslips).where({ Number })
    })

    return super.init()
  }
}
