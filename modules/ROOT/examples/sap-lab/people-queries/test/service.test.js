import cds from '@sap/cds'
import { test } from 'node:test'
import assert from 'node:assert'
const { GET } = cds.test(import.meta.dirname + '/..')
const base = '/odata/v4/people'
const get = async (path) => (await GET(`${base}/${path}`)).data
const rows = async (path) => (await get(path)).value
const rejected = async (path) => {
  try { await GET(`${base}/${path}`); assert.fail('should be rejected') } catch (e) { return e.response ?? e }
}
const today = new Date().toISOString().slice(0, 10)
const subareas = async (query) =>
  (await rows(`OrganizationalAssignments?${query}$select=Employee_PersonnelNumber,PersonnelSubarea&$orderby=Employee_PersonnelNumber`))
    .map((r) => `${r.Employee_PersonnelNumber}:${r.PersonnelSubarea}`)

test('the model holds Ana, Ben and Chloe, Ana with two organizational records', async () => {
  assert.deepEqual((await rows('Employees?$orderby=PersonnelNumber')).map((e) => e.Name), ['Ana Torres', 'Ben Okoye', 'Chloe Martin'])
  const history = await rows("OrganizationalAssignments?fromDate=2024-01-01&toDate=9999-12-31&$filter=Employee_PersonnelNumber eq '00001234'&$orderby=BeginDate")
  assert.deepEqual(history.map((r) => [r.BeginDate, r.EndDate, r.PersonnelSubarea]), [['2024-03-01', '2026-06-30', '0001'], ['2026-07-01', '9999-12-31', '0002']])
})

test('without a date parameter the answer is the same as asOfDate = today', async () => {
  const none = await subareas('')
  assert.deepEqual(none, await subareas(`asOfDate=${today}&`))
  if (today >= '2026-07-01') assert.deepEqual(none, ['00001234:0002', '00001235:0001', '00001236:0002'])
})

test('asOfDate returns the record that is effective on the date', async () => {
  assert.deepEqual(await subareas('asOfDate=2025-06-30&'), ['00001234:0001', '00001235:0001', '00001236:0002'])
  assert.deepEqual(await subareas('asOfDate=2026-06-30&'), ['00001234:0001', '00001235:0001', '00001236:0002'])
  assert.deepEqual(await subareas('asOfDate=2026-07-01&'), ['00001234:0002', '00001235:0001', '00001236:0002'])
})

test('a date range returns every record that is effective on a day of it', async () => {
  const q = "OrganizationalAssignments?fromDate=2026-06-01&toDate=2026-07-31&$filter=Employee_PersonnelNumber eq '00001234'&$select=BeginDate,EndDate,PersonnelSubarea&$orderby=BeginDate"
  assert.deepEqual((await rows(q)).map((r) => [r.BeginDate, r.EndDate, r.PersonnelSubarea]), [['2024-03-01', '2026-06-30', '0001'], ['2026-07-01', '9999-12-31', '0002']])
  const june = await rows("OrganizationalAssignments?fromDate=2026-06-01&toDate=2026-06-30&$filter=Employee_PersonnelNumber eq '00001234'")
  assert.equal(june.length, 1)
  assert.equal(june[0].PersonnelSubarea, '0001')
})

test('time constraint 2 has a gap: no record is effective inside it', async () => {
  assert.deepEqual((await rows('ParkingPermits?asOfDate=2025-05-31')).map((r) => r.Permit), ['A-1'])
  assert.deepEqual(await rows('ParkingPermits?asOfDate=2025-06-01'), [])
  assert.deepEqual(await rows('ParkingPermits?asOfDate=2024-12-31'), [])
})

test('before the hire date no record is effective', async () => {
  const who = (await rows('OrganizationalAssignments?asOfDate=2024-06-01&$select=Employee_PersonnelNumber')).map((r) => r.Employee_PersonnelNumber)
  assert.deepEqual(who, ['00001234'])
  assert.deepEqual(await subareas('asOfDate=2024-08-31&'), ['00001234:0001'])
  assert.equal((await get('OrganizationalAssignments?asOfDate=2025-06-30&$count=true&$top=0'))['@odata.count'], 3)
})

test('basic pay is effective-dated too', async () => {
  const pay = await rows('BasicPayRecords?asOfDate=2025-06-30&$select=Employee_PersonnelNumber,Amount,PayBasis&$orderby=Employee_PersonnelNumber')
  assert.deepEqual(pay.map((r) => [r.Employee_PersonnelNumber, r.PayBasis, r.Amount]), [['00001234', 'Monthly', '4000.00'], ['00001235', 'Monthly', '2400.00'], ['00001236', 'Hourly', '14.00']])
})

test('wrong date questions are rejected with HTTP 400 and a message', async () => {
  const cases = [
    ['asOfDate=2025-06-30&fromDate=2025-01-01&toDate=2025-12-31', 'Use asOfDate or fromDate with toDate, not both'],
    ['asOfDate=30.06.2025', 'asOfDate must be a date written YYYY-MM-DD'],
    ['asOfDate=2026-02-30', 'asOfDate must be a date written YYYY-MM-DD'],
    ['asOfDate=', 'asOfDate must be a date written YYYY-MM-DD'],
    ['fromDate=2025-01-01', 'fromDate and toDate must be used together'],
    ['fromDate=2026-01-01&toDate=2025-01-01', 'fromDate must not be after toDate'],
  ]
  for (const [query, message] of cases) {
    const r = await rejected(`OrganizationalAssignments?${query}`)
    assert.equal(r.status, 400)
    assert.equal(r.data.error.message, message)
  }
})

test('the parameter name is case sensitive: asofdate is ignored', async () => {
  assert.deepEqual(await subareas('asofdate=2025-06-30&'), await subareas(''))
})

test('Employees is not effective-dated and $expand is not filtered by the date', async () => {
  assert.equal((await get('Employees?asOfDate=2025-06-30&$count=true&$top=0'))['@odata.count'], 3)
  const ana = await rows("Employees?$select=Name&$expand=OrgAssignments($select=BeginDate)&asOfDate=2025-06-30&$filter=PersonnelNumber eq '00001234'")
  assert.equal(ana[0].OrgAssignments.length, 2)
})

test('a range that touches no record is an empty list, a wide range reads the history', async () => {
  assert.deepEqual(await rows('OrganizationalAssignments?fromDate=2024-01-01&toDate=2024-02-29'), [])
  const all = await rows('OrganizationalAssignments?fromDate=2024-01-01&toDate=9999-12-31')
  assert.equal(all.length, 4)
})
