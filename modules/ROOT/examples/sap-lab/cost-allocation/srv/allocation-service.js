import cds from '@sap/cds'

// The rules of the teaching model. Amounts are handled as whole cents and
// tracing factors as thousandths, so every sum is exact.
const cents = (amount) => Math.round(Number(amount) * 100)
const money = (c) => (c / 100).toFixed(2)
const thousandths = (x) => Math.round(Number(x ?? 0) * 1000)

// tag::share[]
// Splits `released` cents among the receivers by weighted reference,
// (Factor / FactorPer) * tracing factor, as the SAP help page on receiver
// weighting factors describes. FactorPer is the same for every receiver, so
// it cancels out of the proportion. Left-over cents go to the largest remainder.
export function split(released, receivers) {
  const weights = receivers.map((r) => BigInt(r.factor) * BigInt(r.reference))
  const total = weights.reduce((a, w) => a + w, 0n)
  const whole = BigInt(released)
  const parts = weights.map((w) => (whole * w) / total)
  const rest = weights.map((w) => (whole * w) % total)
  let left = Number(whole - parts.reduce((a, p) => a + p, 0n))
  const order = rest.map((_, i) => i)
    .sort((a, b) => Number(rest[b] - rest[a]) || a - b)
  for (const i of order) if (left-- > 0) parts[i] += 1n
  return parts.map(Number)
}
// end::share[]

const lastDay = (year, period) => {
  const month = String(Number(period)).padStart(2, '0')
  const day = new Date(Date.UTC(Number(year), Number(period), 0)).getUTCDate()
  return `${year}-${month}-${day}`
}

export default class AllocationService extends cds.ApplicationService {
  init() {
    const { AllocationCycles, AllocationReceivers, KeyFigures } = this.entities
    const { JournalLines, GLAccounts } = this.entities

    // tag::run[]
    this.on('runAllocation', async (req) => {
      const { Cycle, FiscalYear, FiscalPeriod } = req.data
      const month = Number(FiscalPeriod)
      if (!(month >= 1 && month <= 12)) {
        return req.error(400, `Fiscal period ${FiscalPeriod} must be 001 to 012`)
      }
      const cycle = await SELECT.one.from(AllocationCycles, Cycle)
      if (!cycle) return req.error(404, `Allocation cycle ${Cycle} does not exist`)
      const members = await SELECT.from(AllocationReceivers)
        .where({ Cycle_Cycle: Cycle })
      const period = { FiscalYear, FiscalPeriod }
      const document = `ALLOC-${Cycle}-${FiscalYear}-${FiscalPeriod}`
      const sender = cycle.SenderCostCenter

      // Running a cycle again in the same period replaces its earlier lines.
      await DELETE.from(JournalLines)
        .where({ Source: 'ALLOCATION', Document: document })

      // The sender releases its share of what was posted on it in the period.
      const posted = await SELECT.from(JournalLines)
        .where({ ...period, CostCenter: sender, GLAccount: cycle.SenderAccount })
      const balance = posted
        .reduce((s, l) => s + cents(l.AmountInCompanyCodeCurrency), 0)
      if (balance <= 0) {
        const where = `${cycle.SenderAccount} in ${FiscalYear}/${FiscalPeriod}`
        return req.error(400, `Nothing to allocate: cost center ${sender} `
          + `has a balance of ${money(balance)} on account ${where}`)
      }
      const released = Math.round((balance * Number(cycle.SenderShare)) / 100)

      // The tracing factor of each receiver is its statistical key figure.
      const figures = await SELECT.from(KeyFigures)
        .where({ KeyFigure: cycle.KeyFigure, FiscalYear })
      const figure = (cc) => figures.find((f) => f.CostCenter === cc)?.Value
      const receivers = members.map((r) => ({
        costCenter: r.CostCenter,
        factor: thousandths(r.Factor),
        reference: thousandths(figure(r.CostCenter)),
      }))
      if (receivers.every((r) => r.factor * r.reference === 0)) {
        return req.error(400, `The tracing factors of cycle ${Cycle} add up to 0`)
      }
      const shares = split(released, receivers)

      // Assessment posts on the overhead account, distribution on the original one.
      const distribution = cycle.AllocationType === 'DISTRIBUTION'
      const account = distribution ? cycle.SenderAccount : cycle.OverheadAccount
      const postingDate = lastDay(FiscalYear, FiscalPeriod)
      const lines = [{ CostCenter: sender, Amount: money(-released) }]
      receivers.forEach((r, i) => {
        if (shares[i]) {
          lines.push({ CostCenter: r.costCenter, Amount: money(shares[i]) })
        }
      })
      await INSERT.into(JournalLines).entries(lines.map((l) => ({
        Document: document, PostingDate: postingDate, ...period, GLAccount: account,
        CostCenter: l.CostCenter, AmountInCompanyCodeCurrency: l.Amount,
        Text: cycle.Description, Source: 'ALLOCATION',
      })))
      return {
        Cycle, PostingDate: postingDate, Released: money(released),
        Lines: lines.map((l) => ({ ...l, GLAccount: account })),
      }
    })
    // end::run[]

    // tag::trial[]
    this.on('trialBalance', async (req) => {
      const { FromPostingDate: from, ToPostingDate: to } = req.data
      if (!from || !to || from > to) {
        return req.error(400, 'Give FromPostingDate and ToPostingDate, from first')
      }
      const lines = await SELECT.from(JournalLines)
        .where({ PostingDate: { '<=': to } })
      const accounts = await SELECT.from(GLAccounts)
      const name = (id) => accounts.find((a) => a.GLAccount === id)?.Name ?? ''
      const sums = {}
      for (const l of lines) {
        const s = (sums[l.GLAccount] ??= { start: 0, debit: 0, credit: 0 })
        const c = cents(l.AmountInCompanyCodeCurrency)
        if (l.PostingDate < from) s.start += c
        else if (c > 0) s.debit += c
        else s.credit -= c
      }
      const Rows = Object.keys(sums).sort().map((id) => {
        const { start, debit, credit } = sums[id]
        return {
          GLAccount: id, Name: name(id), StartingBalance: money(start),
          Debits: money(debit), Credits: money(credit),
          EndingBalance: money(start + debit - credit),
        }
      })
      const sum = (key) => Rows.reduce((s, r) => s + cents(r[key]), 0)
      const [start, debit, credit, end] =
        ['StartingBalance', 'Debits', 'Credits', 'EndingBalance'].map(sum)
      return {
        Rows, TotalStartingBalance: money(start), TotalDebits: money(debit),
        TotalCredits: money(credit), TotalEndingBalance: money(end),
        Balanced: debit === credit && end === 0,
      }
    })
    // end::trial[]

    return super.init()
  }
}
