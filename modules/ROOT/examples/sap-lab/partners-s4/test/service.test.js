import cds from '@sap/cds'
import { test } from 'node:test'
import assert from 'node:assert'
// --with-mocks serves the imported SAP API as a mock, as cds watch does
const { GET, POST } = cds.test(
  'serve', '--with-mocks', '--in-memory?', '--project', import.meta.dirname + '/..'
)
const base = '/odata/v4/partner-dashboard'
test('the dashboard lists the six sample partners with its own names', async () => {
  const { data } = await GET(`${base}/Partners?$orderby=ID`)
  assert.equal(data.value.length, 6)
  assert.deepEqual(data.value[0], {
    ID: '1000001', name: 'Example Trading Co.', category: '2'
  })
})
test('a filter on the renamed element reaches the mocked API', async () => {
  const { data } = await GET(`${base}/Partners?$filter=contains(name,'Ltd')&$select=ID,name`)
  assert.deepEqual(data.value, [{ ID: '1000006', name: 'Warehouse Supplies Ltd.' }])
})
test('the count of the dashboard equals the rows of the mock', async () => {
  const { data } = await GET(`${base}/Partners/$count`)
  assert.equal(Number(data), 6)
})
test('the mocked API answers on its own path with the names of SAP', async () => {
  const { data } = await GET('/odata/v4/api-business-partner/A_BusinessPartner/1000003')
  assert.equal(data.BusinessPartnerFullName, 'Ana Torres')
  assert.equal(data.Customer, null)
})
test('the dashboard is read only', async () => {
  try {
    await POST(`${base}/Partners`, { ID: '1000007', name: 'New partner' })
    assert.fail('should be rejected')
  } catch (e) {
    assert.ok([400, 403, 405].includes(e.response?.status ?? e.status))
  }
})
