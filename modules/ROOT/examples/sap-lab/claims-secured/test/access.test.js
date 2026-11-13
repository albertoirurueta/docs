import cds from '@sap/cds'
import { test } from 'node:test'
import assert from 'node:assert'

const { GET, PATCH, POST } = cds.test(import.meta.dirname + '/..')
const base = '/odata/v4/claims/Claims'
const id = '11111111-1111-1111-1111-111111111111'
const any = { validateStatus: s => s }
const as = name => ({ auth: { username: name, password: '' }, ...any })

test('without a login the answer is 401', async () => {
  const res = await GET(base, any)
  assert.strictEqual(res.status, 401)
})

test('alice and bob may read', async () => {
  for (const name of ['alice', 'bob']) {
    const res = await GET(base, as(name))
    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.data.value.length, 2)
  }
})

test('bob may not change a claim, alice may', async () => {
  const denied = await PATCH(`${base}(${id})`, { amount: 50 }, as('bob'))
  assert.strictEqual(denied.status, 403)
  const done = await PATCH(`${base}(${id})`, { amount: 50 }, as('alice'))
  assert.strictEqual(done.status, 200)
})

test('only alice may approve', async () => {
  const url = `${base}(${id})/ClaimsService.approve`
  const denied = await POST(url, {}, as('bob'))
  assert.strictEqual(denied.status, 403)
  const done = await POST(url, {}, as('alice'))
  assert.ok(done.status < 300)
})
