import cds from '@sap/cds'
import { test } from 'node:test'
import assert from 'node:assert'
const { GET } = cds.test(import.meta.dirname + '/..')
test('lists the four claims', async () => {
  const { data } = await GET('/odata/v4/claim/Claims?$count=true')
  assert.strictEqual(data['@odata.count'], 4)
})
test('filters by part of the title', async () => {
  const q = "/odata/v4/claim/Claims?$filter=contains(title,'Hotel')"
  const { data } = await GET(q)
  assert.deepStrictEqual(data.value.map((c) => c.title), ['Hotel Berlin'])
})
