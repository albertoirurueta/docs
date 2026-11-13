import cds from '@sap/cds'
import { test } from 'node:test'
import assert from 'node:assert'
import { decliningAmount, evenAmount, schedule } from '../srv/schedule.js'
const { GET } = cds.test(import.meta.dirname + '/..')
const url = '/odata/v4/depreciation'
const amounts = (rows) => rows.map((r) => r.Depreciation)
const nbvs = (rows) => rows.map((r) => r.NetBookValue)
const fn = (m, base, years, factor) =>
  `${url}/calculate(Method='${m}',Base=${base},Years=${years},Factor=${factor})`
const rejected = async (path) => {
  try { await GET(path); assert.fail('should be rejected') }
  catch (e) { return e.response ?? e }
}

// tag::sap[]
// The three worked examples of the SAP help pages for the methods.
test('SAP example: APC 1,000 over 10 years is 100 a year', () => {
  assert.equal(evenAmount(100000, 10), 10000)
})
test('SAP example: net book value 500 over 5 remaining years is 100', () => {
  assert.equal(evenAmount(50000, 5), 10000)
})
test('SAP example: net book value 700, life 10, factor 3 is 210', () => {
  assert.equal(decliningAmount(70000, 10, 3), 21000)
})
// end::sap[]

// tag::van[]
test('straight-line schedule of the van', () => {
  const rows = schedule({ method: 'straight-line', base: 15000, years: 5 })
  assert.deepEqual(amounts(rows), Array(5).fill('3000.00'))
  assert.equal(rows[4].NetBookValue, '0.00')
})
test('declining balance with changeover for the van', () => {
  const rows = schedule(
    { method: 'declining-balance', base: 15000, years: 5, factor: 2 })
  assert.deepEqual(amounts(rows),
    ['6000.00', '3600.00', '1800.00', '1800.00', '1800.00'])
  assert.deepEqual(nbvs(rows),
    ['9000.00', '5400.00', '3600.00', '1800.00', '0.00'])
  assert.deepEqual(rows.map((r) => r.Rule),
    ['declining', 'declining', 'changeover', 'changeover', 'changeover'])
})
// end::van[]

test('the group area of EX01 has an APC of 15,300.00: 3,060.00 a year', () => {
  const rows = schedule({ method: 'straight-line', base: 15300, years: 5 })
  assert.deepEqual(new Set(amounts(rows)), new Set(['3060.00']))
})
test('the sum of every schedule equals the base, whatever the rounding', () => {
  for (const method of ['straight-line', 'remaining-life', 'declining-balance']) {
    const rows = schedule({ method, base: 1000, years: 3, factor: 2 })
    const sum = (a, r) => a + Math.round(Number(r.Depreciation) * 100)
    assert.equal(rows.reduce(sum, 0), 100000)
  }
  const rows = schedule({ method: 'straight-line', base: 1000, years: 3 })
  assert.deepEqual(amounts(rows), ['333.33', '333.34', '333.33'])
})

test('the function answers the remaining-life example', async () => {
  const { status, data } = await GET(fn('remaining-life', 500, 5, 0))
  assert.equal(status, 200)
  assert.deepEqual(amounts(data.value), Array(5).fill('100.00'))
})
test('the bound function reads the van from its master record', async () => {
  const { data } = await GET(`${url}/Assets('10001')/plan()`)
  assert.deepEqual(amounts(data.value),
    ['6000.00', '3600.00', '1800.00', '1800.00', '1800.00'])
})
test('the bound function uses the method of the shelving', async () => {
  const { data } = await GET(`${url}/Assets('10002')/plan()`)
  assert.equal(data.value.length, 10)
  assert.equal(data.value[0].Depreciation, '1200.00')
})
test('rejects an unknown method', async () => {
  const r = await rejected(fn('sum-of-digits', 15000, 5, 0))
  assert.equal(r.status, 400)
  assert.match(r.data.error.message, /Unknown method sum-of-digits/)
})
test('rejects declining balance without a factor and zero years', async () => {
  const a = await rejected(fn('declining-balance', 15000, 5, 0))
  assert.match(a.data.error.message, /needs a Factor/)
  const b = await rejected(fn('straight-line', 15000, 0, 0))
  assert.match(b.data.error.message, /Years must be a whole number/)
})
