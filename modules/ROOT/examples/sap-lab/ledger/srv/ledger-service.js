import cds from '@sap/cds'

// The posting rules of the teaching ledger. cents() turns an amount into whole
// cents so that the sums are exact.
const cents = (amount) => Math.round(Number(amount) * 100)
const money = (c) => (c / 100).toFixed(2)

export default class LedgerService extends cds.ApplicationService {
  init() {
    const { PostingPeriods } = this.entities

    this.before('CREATE', 'JournalEntries', async (req) => {
      const entry = req.data
      const items = entry.Items ?? []

      // Rule 1: the posting date decides the fiscal year and the posting period
      // (this model: calendar year, 12 monthly periods).
      const [year, month] = (entry.PostingDate ?? '').split('-').map(Number)
      if (!year || !month) {
        return req.error(400, 'A posting date such as 2026-03-15 is required', 'in/PostingDate')
      }
      entry.FiscalYear = String(year)
      entry.FiscalPeriod = String(month).padStart(3, '0')

      // Rule 2: the posting period must be open for the company code.
      const key = {
        CompanyCode: entry.CompanyCode ?? 'EX01',
        FiscalYear: entry.FiscalYear,
        FiscalPeriod: entry.FiscalPeriod,
      }
      const period = await SELECT.one.from(PostingPeriods).where(key)
      if (!period?.Open) {
        const message = `Posting period ${key.FiscalYear}/${key.FiscalPeriod} is closed for company code ${key.CompanyCode}`
        return req.error(400, message, 'in/PostingDate')
      }

      // Rule 3: an entry has at least two lines, and its debits equal its credits.
      if (items.length < 2) {
        return req.error(400, 'A journal entry needs at least two lines', 'in/Items')
      }
      const lines = items.map((i) => cents(i.AmountInCompanyCodeCurrency))
      const debit = lines.filter((c) => c > 0).reduce((a, c) => a + c, 0)
      const credit = lines.filter((c) => c < 0).reduce((a, c) => a - c, 0)
      if (debit !== credit) {
        const [dr, cr] = [debit, credit].map(money)
        const message = `Entry is not balanced: debits ${dr}, credits ${cr}`
        return req.error(400, message, 'in/Items')
      }
    })

    return super.init()
  }
}
