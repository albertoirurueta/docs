import cds from '@sap/cds'
import { test } from 'node:test'
import assert from 'node:assert'
const { GET, POST, PATCH, DELETE } = cds.test(import.meta.dirname + '/..')
const base = '/odata/v4/org'
const rejected = async (call) => {
  try { await call(); assert.fail('should be rejected') } catch (e) { return e.response ?? e }
}
const evaluate = async (id, path = 'O-S-P', type = 'O') =>
  (await GET(`${base}/evaluate(startType='${type}',startId='${id}',path='${path}')`)).data.value
const ids = (rows, step) => rows.filter((r) => r.Step === step).map((r) => r.ObjectId)
const relationshipsOf = async (id) => (await GET(
  `${base}/Relationships?$filter=SourceId eq '${id}'&$orderby=Relationship,TargetId`)).data.value
const add = (rel) => POST(`${base}/Relationships`, rel)

test('the example has 11 objects and 24 stored relationship records', async () => {
  assert.equal((await GET(`${base}/Objects?$count=true&$top=0`)).data['@odata.count'], 11)
  assert.equal((await GET(`${base}/Relationships?$count=true&$top=0`)).data['@odata.count'], 24)
})
test('every relationship is stored from both ends', async () => {
  const sales = await relationshipsOf('50000002')
  assert.deepEqual(sales.map((r) => `${r.Relationship} ${r.TargetId}`),
    ['A002 50000001', 'B003 51000001', 'B003 51000002', 'B012 51000001'])
})
test('O-S-P from the top unit collects 9 objects', async () => {
  const rows = await evaluate('50000001')
  assert.equal(rows.length, 9)
  assert.deepEqual(ids(rows, 1), ['50000001', '50000002', '50000003'])
  assert.deepEqual(ids(rows, 2), ['51000001', '51000002', '51000003'])
  assert.deepEqual(ids(rows, 3), ['00001234', '00001235', '00001236'])
})
test('O-S-P from Sales collects 5 objects and from Warehouse 3', async () => {
  const sales = await evaluate('50000002')
  assert.equal(sales.length, 5)
  assert.deepEqual(ids(sales, 3), ['00001234', '00001235'])
  const warehouse = await evaluate('50000003')
  assert.equal(warehouse.length, 3)
  assert.deepEqual(ids(warehouse, 3), ['00001236'])
})
test('the tree shows each position with its holder and marks the chief', async () => {
  const nodes = (await GET(`${base}/tree(startId='50000001')`)).data.value
  assert.equal(nodes.length, 9)
  assert.deepEqual(nodes.map((n) => n.Level), [0, 1, 2, 3, 2, 3, 1, 2, 3])
  assert.deepEqual(nodes.filter((n) => n.Chief).map((n) => n.ObjectId), ['51000001'])
})
test('an unknown path, start object or start type is rejected', async () => {
  assert.equal((await rejected(() => evaluate('50000002', 'X-Y'))).status, 404)
  assert.equal((await rejected(() => evaluate('59999999'))).status, 404)
  assert.equal((await rejected(() => evaluate('51000001', 'O-S-P', 'S'))).status, 400)
})
test('a rejected relationship leaves the structure unchanged', async () => {
  const messages = async (rel) => (await rejected(() => add(rel))).data.error.message
  const sales = { SourceType: 'S', SourceId: '51000002', TargetType: 'O', TargetId: '50000002' }
  assert.equal(await messages({ Relationship: 'A012', ...sales }),
    'Unit 50000002 already has the chief position 51000001')
  assert.equal(await messages({ Relationship: 'A002', SourceType: 'O', SourceId: '50000001',
    TargetType: 'O', TargetId: '50000003' }),
  'Unit 50000001 cannot report to 50000003, which is not above it')
  assert.equal(await messages({ Relationship: 'A009', ...sales }),
    'Relationship A009 is not defined')
  assert.equal(await messages({ Relationship: 'A003', ...sales, TargetType: 'P', TargetId: '00001234' }),
    'Relationship A003 links S to O, not S to P')
  assert.equal(await messages({ Relationship: 'A003', ...sales, SourceId: '51000099' }),
    'Object S 51000099 does not exist')
  assert.equal(await messages({ Relationship: 'A003', ...sales }),
    'Relationship A003 from S 51000002 to O 50000002 already exists')
  assert.equal((await evaluate('50000001')).length, 9)
})
test('a new position and its relationship are stored as a pair', async () => {
  await POST(`${base}/Objects`, { ObjectType: 'S', ObjectId: '51000004', Name: 'Sales Assistant' })
  const r = await add({ Relationship: 'A003', SourceType: 'S', SourceId: '51000004',
    TargetType: 'O', TargetId: '50000002' })
  assert.equal(r.status, 201)
  assert.match(r.headers['sap-messages'],
    /Relationship A003 was stored with its inverse B003/)
  const sales = await relationshipsOf('50000002')
  assert.ok(sales.some((x) => x.Relationship === 'B003' && x.TargetId === '51000004'))
  assert.equal(sales.length, 5)
})
test('the new position has no holder: O-S-P from Sales now collects 6 objects', async () => {
  const rows = await evaluate('50000002')
  assert.equal(rows.length, 6)
  assert.deepEqual(ids(rows, 2), ['51000001', '51000002', '51000004'])
  assert.deepEqual(ids(rows, 3), ['00001234', '00001235'])
  const nodes = (await GET(`${base}/tree(startId='50000002')`)).data.value
  assert.deepEqual(nodes.map((n) => n.ObjectId),
    ['50000002', '51000001', '00001234', '51000002', '00001235', '51000004'])
})
test('a path of your own is a record: O-S-C returns positions and jobs', async () => {
  const create = await POST(`${base}/EvaluationPaths`, {
    Path: 'O-S-C', Description: 'Jobs of the positions of a unit',
    Steps: [{ Row: 1, FromType: 'O', Relationship: 'B003', ToType: 'S' },
      { Row: 2, FromType: 'S', Relationship: 'A007', ToType: 'C' }] })
  assert.equal(create.status, 201)
  const rows = await evaluate('50000002', 'O-S-C')
  assert.equal(rows.length, 5)
  assert.deepEqual(ids(rows, 2), ['52000001', '52000002'])
})
test('objects and relationships are only added, never changed or deleted', async () => {
  const object = `${base}/Objects(ObjectType='S',ObjectId='51000004')`
  const del = await rejected(() => DELETE(object))
  assert.equal(del.status, 405)
  assert.equal(del.data.error.message, 'Entity "Objects" is not deletable')
  assert.equal((await rejected(() => PATCH(object, { Name: 'X' }))).status, 405)
})
test('the tree page is served', async () => {
  const page = await GET('/tree/index.html')
  assert.match(page.data, /Organizational structure/)
})
