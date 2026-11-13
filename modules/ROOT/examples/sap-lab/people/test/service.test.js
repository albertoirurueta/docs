import cds from '@sap/cds'
import { test } from 'node:test'
import assert from 'node:assert'
const { GET, POST, DELETE } = cds.test(import.meta.dirname + '/..')
const base = '/odata/v4/people'
const history = async (entity) => (await GET(`${base}/${entity}?$filter=Employee_PersonnelNumber eq '00001234'&$orderby=BeginDate`)).data.value
const rejected = async (call) => {
  try { await call(); assert.fail('should be rejected') } catch (e) { return e.response ?? e }
}
test('a new time constraint 1 record delimits the old one without a gap', async () => {
  await POST(`${base}/OrganizationalAssignments`, { Employee_PersonnelNumber: '00001234', BeginDate: '2026-07-01', PersonnelSubarea: '0002' })
  const [old, current] = await history('OrganizationalAssignments')
  assert.equal(old.EndDate, '2026-06-30')
  assert.equal(current.BeginDate, '2026-07-01')
  assert.equal(current.EndDate, '9999-12-31')
})
test('a new time constraint 2 record delimits the old one', async () => {
  await POST(`${base}/ParkingPermits`, { Employee_PersonnelNumber: '00001234', BeginDate: '2025-06-01', Permit: 'B-2' })
  const [old] = await history('ParkingPermits')
  assert.equal(old.EndDate, '2025-05-31')
})
test('records of time constraint 1 cannot be deleted, records of time constraint 2 can', async () => {
  const r = await rejected(() => DELETE(`${base}/BasicPayRecords(Employee_PersonnelNumber='00001234',BeginDate=2024-03-01)`))
  assert.equal(r.status, 400)
  const ok = await DELETE(`${base}/ParkingPermits(Employee_PersonnelNumber='00001234',BeginDate=2025-06-01)`)
  assert.equal(ok.status, 204)
})
test('a record cannot start before the latest one', async () => {
  const r = await rejected(() => POST(`${base}/ParkingPermits`, { Employee_PersonnelNumber: '00001234', BeginDate: '2025-01-01', Permit: 'C-3' }))
  assert.equal(r.status, 400)
})
