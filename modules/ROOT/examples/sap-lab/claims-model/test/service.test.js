import cds from '@sap/cds'
import { test } from 'node:test'
import assert from 'node:assert'
const { GET, POST } = cds.test(import.meta.dirname + '/..')
const base = '/odata/v4/claims'
const one = 'a1111111-1111-1111-1111-111111111111'
const two = 'a2222222-2222-2222-2222-222222222222'
const item = (description, amount, category_code = 'TRAVEL') =>
  ({ description, amount, category_code })
const rejected = async (path, body) => {
  try {
    await POST(path, body)
    assert.fail('should be rejected')
  } catch (e) {
    return e.response ?? e
  }
}
test('reads a claim with its items and their categories', async () => {
  const query = '$expand=items($expand=category)&$orderby=title'
  const { data } = await GET(`${base}/Claims?${query}`)
  assert.equal(data.value.length, 2)
  assert.equal(data.value[0].items.length, 2)
  assert.equal(data.value[0].items[0].category.name, 'Travel')
})
test('posts a claim with items in one request and sums the total', async () => {
  const items = [item('Flight', 220), item('Lunch', 24.75, 'MEALS')]
  const { status, data } = await POST(`${base}/Claims`, { title: 'Trip', items })
  assert.equal(status, 201)
  assert.equal(data.total, '244.75')
  assert.equal(data.status, 'N')
  assert.equal(data.items.length, 2)
})
test('rejects an item with an amount of zero or less', async () => {
  const body = { title: 'Taxi', items: [item('Ride', -18)] }
  const r = await rejected(`${base}/Claims`, body)
  assert.equal(r.status, 400)
  assert.match(r.data.error.message, /Item "Ride" needs an amount above zero/)
})
test('collects several errors in one answer', async () => {
  const r = await rejected(`${base}/Claims`, { title: ' ', items: [] })
  assert.equal(r.status, 400)
  assert.equal(r.data.error.code, 'MULTIPLE_ERRORS')
  assert.equal(r.data.error.details.length, 2)
})
test('rejects an item with an unknown category', async () => {
  const body = { title: 'Odd', items: [item('X', 5, 'NOPE')] }
  const r = await rejected(`${base}/Claims`, body)
  assert.equal(r.status, 400)
  assert.equal(r.data.error.code, 'ASSERT_TARGET')
})
test('submits a new claim once, then refuses a second submit', async () => {
  const url = `${base}/Claims(${one})/ClaimsService.submit`
  const { status, data } = await POST(url, {})
  assert.equal(status, 200)
  assert.equal(data.status, 'S')
  const again = await rejected(url, {})
  assert.equal(again.status, 409)
  assert.match(again.data.error.message, /already submitted/)
})
test('refuses to submit a claim that was submitted before', async () => {
  const r = await rejected(`${base}/Claims(${two})/ClaimsService.submit`, {})
  assert.equal(r.status, 409)
})
