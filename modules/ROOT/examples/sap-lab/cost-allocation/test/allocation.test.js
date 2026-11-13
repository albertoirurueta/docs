import cds from '@sap/cds'
import { test, beforeEach } from 'node:test'
import assert from 'node:assert'
import { split } from '../srv/allocation-service.js'

const { GET, POST, PATCH, data } = cds.test(import.meta.dirname + '/..')
const base = '/odata/v4/allocation'
beforeEach(() => data.reset())

const run = (Cycle, FiscalPeriod = '003') =>
  POST(`${base}/runAllocation`, { Cycle, FiscalYear: '2026', FiscalPeriod })
const rejected = async (promise) => {
  try { await promise; assert.fail('should be rejected') } catch (e) { return e.response ?? e }
}
const trial = async (from, to) => {
  const { data } = await GET(`${base}/trialBalance(FromPostingDate=${from},ToPostingDate=${to})`)
  return data
}
const balances = async () => {
  const { data } = await GET(`${base}/CostCenterBalances?$orderby=CostCenter,GLAccount`)
  return data.value.map((b) => `${b.CostCenter} ${b.GLAccount} ${b.Balance}`)
}
const amounts = (result) => Object.fromEntries(result.Lines.map((l) => [l.CostCenter, l.Amount]))

test('the trial balance of March before the allocation balances', async () => {
  const t = await trial('2026-03-01', '2026-03-31')
  assert.deepEqual(t.Rows.map((r) => [r.GLAccount, r.StartingBalance, r.Debits, r.Credits, r.EndingBalance]), [
    ['113100', '20000.00', '0.00', '1000.00', '19000.00'],
    ['300000', '-20000.00', '0.00', '0.00', '-20000.00'],
    ['455000', '0.00', '1000.00', '0.00', '1000.00'],
  ])
  assert.deepEqual([t.TotalStartingBalance, t.TotalDebits, t.TotalCredits, t.TotalEndingBalance, t.Balanced],
    ['0.00', '1000.00', '1000.00', '0.00', true])
})

test('the assessment splits 1,000.00 by floor area: 200, 300 and 500', async () => {
  const { data: r } = await run('RENT')
  assert.equal(r.Released, '1000.00')
  assert.equal(r.PostingDate, '2026-03-31')
  assert.deepEqual(amounts(r), { 'EX-RENT': '-1000.00', 'EX-ADM': '200.00', 'EX-SALES': '300.00', 'EX-PROD': '500.00' })
  assert.deepEqual(await balances(), [
    'EX-ADM 940000 200.00', 'EX-PROD 940000 500.00', 'EX-RENT 455000 1000.00',
    'EX-RENT 940000 -1000.00', 'EX-SALES 940000 300.00',
  ])
})

test('after the allocation debits still equal credits', async () => {
  await run('RENT')
  const t = await trial('2026-03-01', '2026-03-31')
  assert.deepEqual([t.TotalDebits, t.TotalCredits, t.Balanced], ['2000.00', '2000.00', true])
  const overhead = t.Rows.find((r) => r.GLAccount === '940000')
  assert.deepEqual([overhead.Debits, overhead.Credits, overhead.EndingBalance], ['1000.00', '1000.00', '0.00'])
  const april = await trial('2026-04-01', '2026-04-30')
  assert.deepEqual([april.TotalDebits, april.TotalCredits, april.TotalStartingBalance], ['0.00', '0.00', '0.00'])
})

test('running the cycle again replaces its lines', async () => {
  await run('RENT')
  await run('RENT')
  const { data } = await GET(`${base}/JournalLines?$filter=Source eq 'ALLOCATION'&$count=true`)
  assert.equal(data['@odata.count'], 4)
})

test('a sender share of 50 percent releases 500.00: 100, 150 and 250', async () => {
  await PATCH(`${base}/AllocationCycles('RENT')`, { SenderShare: 50 })
  const { data: r } = await run('RENT')
  assert.equal(r.Released, '500.00')
  assert.deepEqual(amounts(r), { 'EX-RENT': '-500.00', 'EX-ADM': '100.00', 'EX-SALES': '150.00', 'EX-PROD': '250.00' })
})

test('a weighting factor of 0 excludes a receiver', async () => {
  const { data: receivers } = await GET(`${base}/AllocationReceivers?$filter=CostCenter eq 'EX-PROD'`)
  await PATCH(`${base}/AllocationReceivers(${receivers.value[0].ID})`, { Factor: 0 })
  const { data: r } = await run('RENT')
  assert.deepEqual(amounts(r), { 'EX-RENT': '-1000.00', 'EX-ADM': '400.00', 'EX-SALES': '600.00' })
})

test('a distribution keeps the original account on the receivers', async () => {
  await PATCH(`${base}/AllocationCycles('RENT')`, { AllocationType: 'DISTRIBUTION' })
  const { data: r } = await run('RENT')
  assert.ok(r.Lines.every((l) => l.GLAccount === '455000'))
  assert.deepEqual((await balances()).filter((b) => b.startsWith('EX-ADM')), ['EX-ADM 455000 200.00'])
})

// The worked example of the SAP help page "Receiver Weighting Factors": 500 from
// one sender, employees 200, 200 and 300, factors 20, 30 and 50, Factor Per 100,
// gives 80, 120 and 300.
test('the SAP help example of receiver weighting factors', async () => {
  const figures = [['EX-ADM', 200], ['EX-SALES', 200], ['EX-PROD', 300]]
  for (const [CostCenter, Value] of figures) {
    await POST(`${base}/KeyFigures`, { CostCenter, KeyFigure: 'EMPLOYEES', FiscalYear: '2026', Value, Unit: 'EA' })
  }
  await POST(`${base}/JournalLines`, { Document: 'T-1', PostingDate: '2026-04-10', FiscalYear: '2026', FiscalPeriod: '004', GLAccount: '455000', CostCenter: 'EX-RENT', AmountInCompanyCodeCurrency: 500 })
  await POST(`${base}/AllocationCycles`, {
    Cycle: 'CAFE', SenderCostCenter: 'EX-RENT', SenderAccount: '455000', KeyFigure: 'EMPLOYEES', FactorPer: 100,
    Receivers: [{ CostCenter: 'EX-ADM', Factor: 20 }, { CostCenter: 'EX-SALES', Factor: 30 }, { CostCenter: 'EX-PROD', Factor: 50 }],
  })
  const { data: r } = await run('CAFE', '004')
  assert.equal(r.Released, '500.00')
  assert.deepEqual(amounts(r), { 'EX-RENT': '-500.00', 'EX-ADM': '80.00', 'EX-SALES': '120.00', 'EX-PROD': '300.00' })
})

test('the split gives left-over cents to the largest remainders', () => {
  const same = [1, 2, 3].map(() => ({ factor: 1000, reference: 100000 }))
  assert.deepEqual(split(100, same), [34, 33, 33])
  assert.deepEqual(split(100000, same).reduce((a, b) => a + b), 100000)
  assert.deepEqual(split(1000, [{ factor: 1000, reference: 3 }, { factor: 1000, reference: 6 }]), [333, 667])
})

test('a period without a posting on the sender has nothing to allocate', async () => {
  const r = await rejected(run('RENT', '004'))
  assert.equal(r.status, 400)
  assert.match(r.data.error.message, /Nothing to allocate: cost center EX-RENT has a balance of 0.00 on account 455000 in 2026\/004/)
})

test('a cycle without tracing factors is rejected', async () => {
  await PATCH(`${base}/AllocationCycles('RENT')`, { KeyFigure: 'HEADCOUNT' })
  const r = await rejected(run('RENT'))
  assert.equal(r.status, 400)
  assert.match(r.data.error.message, /tracing factors of cycle RENT add up to 0/)
})

test('an unknown cycle and an invalid period are rejected', async () => {
  assert.equal((await rejected(run('NONE'))).status, 404)
  const r = await rejected(run('RENT', '013'))
  assert.match(r.data.error.message, /Fiscal period 013 must be 001 to 012/)
})

test('a single line posted by hand makes the trial balance unbalanced', async () => {
  await POST(`${base}/JournalLines`, { Document: 'T-2', PostingDate: '2026-03-20', FiscalYear: '2026', FiscalPeriod: '003', GLAccount: '455000', CostCenter: 'EX-ADM', AmountInCompanyCodeCurrency: 100 })
  const t = await trial('2026-03-01', '2026-03-31')
  assert.deepEqual([t.TotalDebits, t.TotalCredits, t.Balanced], ['1100.00', '1000.00', false])
})

test('the trial balance needs a valid time frame', async () => {
  const r = await rejected(GET(`${base}/trialBalance(FromPostingDate=2026-03-31,ToPostingDate=2026-03-01)`))
  assert.equal(r.status, 400)
})
