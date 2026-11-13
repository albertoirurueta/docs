import cds from '@sap/cds'
import { test } from 'node:test'
import assert from 'node:assert'

const { GET, POST, PATCH } = cds.test(import.meta.dirname + '/..')
const base = '/odata/v4/query'

test('$select returns only the named fields and the key', async () => {
  const { data } = await GET(`${base}/Claims?$select=title,amount&$top=1`)
  assert.deepEqual(data.value[0], { title: 'Train ticket', amount: '45.50', ID: 1 })
})

test('$filter and $orderby keep and sort the matching claims', async () => {
  const url = `${base}/Claims?$filter=status eq 'A' and amount gt 50`
    + '&$orderby=amount desc&$select=title'
  const { data } = await GET(url)
  assert.deepEqual(data.value.map((c) => c.title),
    ['Flight Berlin', 'Hotel Madrid', 'Client dinner', 'Team lunch'])
})

test('$top and $skip page through the claims', async () => {
  const page = async (skip) => (await GET(
    `${base}/Claims?$top=5&$skip=${skip}&$orderby=ID&$count=true`)).data
  assert.equal((await page(0)).value.length, 5)
  const last = await page(10)
  assert.equal(last['@odata.count'], 12)
  assert.deepEqual(last.value.map((c) => c.ID), [11, 12])
})

test('$count=true with $top=0 returns the number and no rows', async () => {
  const { data } = await GET(
    `${base}/Claims?$filter=amount gt 50&$count=true&$top=0`)
  assert.equal(data['@odata.count'], 7)
  assert.equal(data.value.length, 0)
  assert.equal((await GET(`${base}/Claims/$count`)).data, 12)
})

test('$expand returns the items inside each claim', async () => {
  const { data } = await GET(`${base}/Claims(4)?$expand=items($select=category)`)
  assert.deepEqual(data.items.map((i) => i.category), ['Registration', 'Workshop'])
  const none = await GET(`${base}/Claims(1)?$expand=items`)
  assert.deepEqual(none.data.items, [])
})

test('$batch answers every request with its own status', async () => {
  const { data } = await POST(`${base}/$batch`, { requests: [
    { id: '1', method: 'GET', url: 'Claims?$select=title&$top=2&$orderby=ID' },
    { id: '2', method: 'GET', url: 'Claims(99)' },
  ] })
  assert.deepEqual(data.responses.map((r) => [r.id, r.status]),
    [['1', 200], ['2', 404]])
  assert.equal(data.responses[0].body.value.length, 2)
})

test('a write creates a claim and its item, a patch changes it', async () => {
  const created = await POST(`${base}/Claims`, {
    ID: 13, title: 'Hotel Lisbon', amount: 120, claimDate: '2026-03-30',
    items: [{ ID: 109, category: 'Room', amount: 120 }],
  })
  assert.equal(created.status, 201)
  assert.equal(created.data.status, 'N')
  const patched = await PATCH(`${base}/Claims(13)`, { status: 'A' })
  assert.equal(patched.status, 200)
  const { data } = await GET(`${base}/Claims(13)?$expand=items`)
  assert.equal(data.status, 'A')
  assert.equal(data.items.length, 1)
})
