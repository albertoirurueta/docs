import cds from '@sap/cds'
import { test } from 'node:test'
import assert from 'node:assert'

const { GET } = cds.test(import.meta.dirname + '/..')

test('lists the claim from the CSV file', async () => {
  const { data } = await GET('/odata/v4/claim/Claims')
  assert.strictEqual(data.value.length, 1)
  assert.strictEqual(data.value[0].title, 'Train ticket')
})
