import cds from '@sap/cds'
import { test, beforeEach } from 'node:test'
import assert from 'node:assert'

const { GET, POST, data } = cds.test(import.meta.dirname + '/..')
beforeEach(() => data.reset())

// tag::first[]
test('lists the two claims of the sample data', async () => {
  const { data } = await GET('/odata/v4/claim/Claims?$orderby=title')
  const titles = data.value.map(c => c.title)
  assert.deepEqual(titles, ['Hotel', 'Train ticket'])
})

test('creates a claim with the status N', async () => {
  const body = { title: 'Taxi', amount: 18 }
  const { status, data } = await POST('/odata/v4/claim/Claims', body)
  assert.equal(status, 201)
  assert.equal(data.status, 'N')
})

test('filters claims by status', async () => {
  const query = `$filter=status eq 'A'`
  const { data } = await GET(`/odata/v4/claim/Claims?${query}`)
  assert.equal(data.value.length, 1)
  assert.equal(data.value[0].title, 'Hotel')
})
// end::first[]

// tag::negative[]
test('rejects a negative amount', async () => {
  await assert.rejects(
    POST('/odata/v4/claim/Claims', { title: 'Refund', amount: -5 }),
    err => err.status === 400 && /must not be negative/.test(err.message)
  )
})
// end::negative[]
