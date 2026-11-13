// Pay arithmetic of the teaching model. Money is whole cents (integers) and a
// rate is in hundredths of a percent (20.00 percent is 2000), so no step of
// the calculation uses floating point money.

// tag::rounding[]
// The rounding rule: divide and round half up to the next whole cent.
// Only values of zero or more are divided here.
export const roundDiv = (numerator, divisor) =>
  (numerator - (numerator % divisor)) / divisor +
  (2 * (numerator % divisor) >= divisor ? 1 : 0)

// A percentage of an amount in cents, rounded to the cent.
export const percentOf = (cents, hundredths) => roundDiv(cents * hundredths, 10000)
// end::rounding[]

// tag::factor[]
export const METHODS = ['PWS', 'PAYMENT', 'DEDUCTION']

// The partial period factor as a fraction numerator / divisor, in working days.
//   planned: working days of the period      absent: days not paid
//   general: the general period working time of the payroll area
export function partialPeriodFactor(method, planned, absent, general) {
  switch (method) {
    case 'PWS': return { numerator: planned - absent, divisor: planned }
    case 'PAYMENT': return { numerator: planned - absent, divisor: general }
    case 'DEDUCTION': return { numerator: general - absent, divisor: general }
  }
}

// Gross pay: the basic pay times the factor, rounded once, to the cent.
export const grossPay = (basicCents, { numerator, divisor }) =>
  roundDiv(basicCents * numerator, divisor)
// end::factor[]

// tag::net[]
// From gross to net. Every line is rounded to the cent on its own; the lines
// that follow are formed from the rounded ones.
export function grossToNet(gross, rates, voluntary) {
  const socialEmployee = percentOf(gross, rates.socialEmployee)
  const taxable = gross - socialEmployee
  const incomeTax = percentOf(taxable, rates.incomeTax)
  const netPay = taxable - incomeTax
  const payment = netPay - voluntary
  const socialEmployer = percentOf(gross, rates.socialEmployer)
  return { socialEmployee, taxable, incomeTax, netPay, payment, socialEmployer,
    employerCost: gross + socialEmployer }
}
// end::net[]

// Dates are YYYY-MM-DD strings, handled in UTC so daylight saving time cannot
// move a day.
const toDate = (text) => new Date(`${text}T00:00:00Z`)
export const addDays = (text, days) => {
  const d = toDate(text)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

// Monday to Friday between two dates, both included. Public holidays are
// ignored, as on the reference page.
export function workingDays(from, to) {
  let count = 0
  for (let day = from; day <= to; day = addDays(day, 1)) {
    const weekday = toDate(day).getUTCDay()
    if (weekday !== 0 && weekday !== 6) count++
  }
  return count
}

// First and last day of a period written YYYY-MM.
export function periodBounds(period) {
  const [year, month] = period.split('-').map(Number)
  const last = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const end = `${period}-${String(last).padStart(2, '0')}`
  return { begin: `${period}-01`, end }
}

// The amount of a number of cents as text, with a thousands separator.
export const money = (cents) =>
  (cents / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const toCents = (amount) => Math.round(Number(amount) * 100)
export const toAmount = (cents) => cents / 100
