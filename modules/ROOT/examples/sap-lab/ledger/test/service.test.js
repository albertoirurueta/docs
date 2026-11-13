import cds from '@sap/cds'
import { test } from 'node:test'
import assert from 'node:assert'
const { GET, POST } = cds.test(import.meta.dirname + '/..')
const entry = (date, ...amounts) => ({
  PostingDate: date,
  Description: 'Test entry',
  Items: amounts.map((a, i) => ({ GLAccount: String(100000 + i), AmountInCompanyCodeCurrency: a })),
})
const rejected = async (body) => {
  try { await POST('/odata/v4/ledger/JournalEntries', body); assert.fail('should be rejected') } catch (e) { return e.response ?? e }
}
test('lists the seeded entry with its lines', async () => {
  const { data } = await GET('/odata/v4/ledger/JournalEntries?$expand=Items')
  assert.equal(data.value.length, 1)
  assert.equal(data.value[0].Items.length, 2)
})
test('posts a balanced entry and derives the period', async () => {
  const { status, data } = await POST('/odata/v4/ledger/JournalEntries', entry('2026-03-15', 12000, -8000, -4000))
  assert.equal(status, 201)
  assert.equal(data.FiscalYear, '2026')
  assert.equal(data.FiscalPeriod, '003')
})
test('rejects an unbalanced entry', async () => {
  const r = await rejected(entry('2026-03-15', 12000, -8000))
  assert.equal(r.status, 400)
  assert.match(r.data.error.message, /not balanced: debits 12000.00, credits 8000.00/)
})
test('rejects an entry in a closed period', async () => {
  const r = await rejected(entry('2026-02-10', 100, -100))
  assert.equal(r.status, 400)
  assert.match(r.data.error.message, /2026\/002 is closed/)
})
