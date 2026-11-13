import cds from '@sap/cds'
import { test } from 'node:test'
import assert from 'node:assert'
import { percentOf, roundDiv, workingDays } from '../srv/pay.js'

const { GET, POST } = cds.test(import.meta.dirname + '/..')
const base = '/odata/v4/payroll'
const ANA = '00001234'
const BEN = '00001235'
const post = (data) => POST(`${base}/calculate`, data)
const calculate = async (PersonnelNumber, Method, extra = {}, Period = '2026-03') =>
  (await post({ PersonnelNumber, Period, Method, ...extra })).data
const rejected = async (data) => {
  try { await post(data); assert.fail('should be rejected') } catch (e) {
    return e.response ?? e
  }
}
// Amounts are compared as whole cents, so no floating point error can hide.
const cents = (amount) => Math.round(Number(amount) * 100)

test('the rounding rule rounds half up to the cent', () => {
  assert.equal(roundDiv(10, 4), 3) // 2.5 rounds up to 3
  assert.equal(roundDiv(9, 4), 2) // 2.25 rounds down to 2
  assert.equal(roundDiv(12, 4), 3) // an exact result stays
  assert.equal(percentOf(10, 1500), 2) // 15.00% of 0.10 is 0.015, so 0.02
  assert.equal(percentOf(185455, 2000), 37091) // 20.00% of 1,854.55
  assert.equal(percentOf(148364, 1500), 22255) // 22,254.6 cents rounds up
})

test('working days are Monday to Friday, public holidays ignored', () => {
  assert.equal(workingDays('2026-03-01', '2026-03-31'), 22)
  assert.equal(workingDays('2026-02-01', '2026-02-28'), 20)
  assert.equal(workingDays('2025-01-15', '2025-01-31'), 13) // Chloe's first month
  assert.equal(workingDays('2026-03-16', '2026-03-20'), 5)
  assert.equal(workingDays('2026-03-16', '2026-03-15'), 0)
})

test('a full month gives Ana the payslip of the reference pages', async () => {
  const p = await calculate(ANA, 'PWS')
  assert.equal(p.Number, 1)
  assert.equal(p.PlannedDays, 22)
  assert.equal(p.AbsentDays, 0)
  assert.equal(Number(p.Factor), 1)
  assert.equal(cents(p.GrossPay), 400000)
  assert.equal(cents(p.SocialEmployee), 80000)
  assert.equal(cents(p.IncomeTax), 48000)
  assert.equal(cents(p.NetPay), 272000)
  assert.equal(cents(p.Voluntary), 0)
  assert.equal(cents(p.Payment), 272000)
  assert.equal(cents(p.SocialEmployer), 84000)
  assert.equal(cents(p.EmployerCost), 484000)
})

test('five unpaid days give three different gross amounts', async () => {
  const pws = await calculate(BEN, 'PWS')
  const payment = await calculate(BEN, 'PAYMENT')
  const deduction = await calculate(BEN, 'DEDUCTION')
  for (const p of [pws, payment, deduction]) {
    assert.equal(p.PlannedDays, 22)
    assert.equal(p.AbsentDays, 5)
    assert.equal(cents(p.BasicPay), 240000)
  }
  assert.deepEqual([pws.Numerator, pws.DivisorDays], [17, 22])
  assert.deepEqual([payment.Numerator, payment.DivisorDays], [17, 21])
  assert.deepEqual([deduction.Numerator, deduction.DivisorDays], [16, 21])
  assert.equal(pws.Factor, '0.7727')
  assert.equal(payment.Factor, '0.8095')
  assert.equal(deduction.Factor, '0.7619')
  assert.equal(cents(pws.GrossPay), 185455)
  assert.equal(cents(payment.GrossPay), 194286)
  assert.equal(cents(deduction.GrossPay), 182857)
})

test('gross to net for Ben with PWS and a voluntary deduction', async () => {
  const p = await calculate(BEN, 'PWS')
  assert.equal(cents(p.GrossPay), 185455)
  assert.equal(cents(p.SocialEmployee), 37091) // 20.00% of 1,854.55
  assert.equal(cents(p.IncomeTax), 22255) // 15.00% of 1,483.64 = 222.546
  assert.equal(cents(p.NetPay), 126109)
  assert.equal(cents(p.Voluntary), 2500)
  assert.equal(cents(p.Payment), 123609)
  assert.equal(cents(p.SocialEmployer), 38946) // 21.00% of 1,854.55 = 389.4555
  assert.equal(cents(p.EmployerCost), 224401)
})

test('the stored payslip lines add up from basic pay to payment', async () => {
  const p = await calculate(BEN, 'PWS')
  const url = `${base}/PayslipLines?$filter=Payslip_Number eq ${p.Number}`
  const lines = (await GET(`${url}&$orderby=Position`)).data.value
  assert.deepEqual(lines.map((l) => l.Text), [
    'Basic pay (monthly)', 'Partial period adjustment', 'Gross pay',
    'Employee social contributions', 'Income tax', 'Net pay',
    'Voluntary: Canteen card', 'Payment',
    'Employer contributions (not on the payslip)'])
  const amount = (i) => cents(lines[i].Amount)
  assert.equal(amount(0) + amount(1), amount(2)) // basic + adjustment = gross
  assert.equal(amount(2) + amount(3) + amount(4), amount(5)) // gross - deductions
  assert.equal(amount(5) + amount(6), amount(7)) // net - voluntary = payment
  assert.equal(lines[1].Basis, '17 / 22 = 0.7727')
  assert.equal(lines[3].Basis, '20.00% of 1,854.55')
  assert.equal(amount(1), -54545)
})

test('without absence the payment method pays above basic pay', async () => {
  const p = await calculate(BEN, 'PAYMENT', {}, '2026-04')
  assert.equal(p.PlannedDays, 22)
  assert.equal(p.AbsentDays, 0)
  assert.equal(cents(p.GrossPay), 251429) // 22 / 21 of 2,400.00
})

test('a month split in two partial periods adds up only with PWS', async () => {
  const first = { FromDate: '2026-03-01', ToDate: '2026-03-15' }
  const second = { FromDate: '2026-03-16', ToDate: '2026-03-31' }
  const pws = await calculate(BEN, 'PWS', first)
  assert.equal(pws.AbsentDays, 12)
  assert.equal(cents(pws.GrossPay), 109091)
  const payment = await calculate(BEN, 'PAYMENT', first)
  assert.equal(cents(payment.GrossPay), 114286)
  const deduction = await calculate(BEN, 'DEDUCTION', first)
  assert.equal(cents(deduction.GrossPay), 102857)
  const a = await calculate(ANA, 'PWS', first)
  const b = await calculate(ANA, 'PWS', second)
  assert.equal(cents(a.GrossPay), 181818)
  assert.equal(cents(b.GrossPay), 218182)
  assert.equal(cents(a.GrossPay) + cents(b.GrossPay), 400000)
})

test('wrong input is rejected with a message', async () => {
  const ok = { PersonnelNumber: ANA, Period: '2026-03', Method: 'PWS' }
  let r = await rejected({ ...ok, Method: 'HYBRID' })
  assert.equal(r.status, 400)
  assert.equal(r.data.error.message,
    'The method must be one of PWS, PAYMENT, DEDUCTION')
  r = await rejected({ ...ok, Period: '2026-13' })
  assert.equal(r.data.error.message, 'The period must be written YYYY-MM')
  r = await rejected({ ...ok, PersonnelNumber: '99999999' })
  assert.equal(r.status, 404)
  r = await rejected({ ...ok, ToDate: '2026-04-02' })
  assert.equal(r.data.error.message,
    'The dates must lie inside 2026-03, from before to')
  r = await rejected({ ...ok, Method: 'DEDUCTION',
    FromDate: '2026-03-01', ToDate: '2026-03-01' })
  assert.equal(r.data.error.message, 'The partial period factor is negative')
})
