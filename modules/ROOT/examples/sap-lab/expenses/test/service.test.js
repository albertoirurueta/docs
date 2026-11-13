import cds from '@sap/cds'
import { test } from 'node:test'
import assert from 'node:assert'
const { GET, expect } = cds.test(import.meta.dirname + '/..')
test('lists claims', async () => {
  const { data } = await GET('/odata/v4/expense/Claims')
  assert.ok(data.value.length >= 1)
})
