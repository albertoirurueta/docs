import { test } from 'node:test'
import assert from 'node:assert'
import cds from '@sap/cds'
import { act, base, lab, lines, rejected } from './helpers.js'

const gr = (quantity) => ({
  PurchaseOrder: 'PO-1', Quantity: quantity, PostingDate: '2026-03-03',
})

test('a missing account determination rejects the posting and rolls back', async () => {
  const { AccountDetermination } = cds.entities('sap.guide.ledgerpostings')
  const row = await SELECT.one.from(AccountDetermination).where({ TransactionKey: 'WRX' })
  await DELETE.from(AccountDetermination).where({ TransactionKey: 'WRX' })
  const r = await rejected('postGoodsReceipt', gr(50))
  assert.equal(r.status, 400)
  assert.equal(r.message, 'No account is determined for key WRX')
  const { data } = await lab.GET(`${base}/PurchaseOrders('PO-1')`)
  assert.equal(data.ReceivedQuantity, 0)
  await INSERT.into(AccountDetermination).entries(row)
})

test('more pieces than ordered are rejected', async () => {
  const r = await rejected('postGoodsReceipt', gr(60))
  assert.deepEqual([r.status, r.message], [400, 'PO-1 has only 50 pieces open'])
})

test('a partial invoice leaves a GR/IR balance that cannot be cleared', async () => {
  await act('postGoodsReceipt', gr(50))
  // 30 x 8.00 = 240.00 at the order price; 50 x 8.00 = 400.00 were received.
  await act('postInvoiceReceipt', {
    PurchaseOrder: 'PO-1', Quantity: 30, InvoicePrice: 8, PostingDate: '2026-03-10',
  })
  assert.deepEqual(await lines('100000002'), [
    ['WRX', '231000', '240.00'],
    ['INTAX', '154000', '45.60'],
    ['VENDOR', '160000', '-285.60'],
  ])
  const r = await rejected('clearOpenItems', {
    GLAccount: '231000', Reference: 'PO-1', ClearingDate: '2026-03-10',
  })
  assert.deepEqual([r.status, r.message],
    [400, 'Items do not add up to zero: debits 240.00, credits 400.00'])
})

test('a sale cannot take more than the stock', async () => {
  const r = await rejected('postSale', {
    Material: 'M-100', Quantity: 60, NetPrice: 12.5, Customer: 'C-2000',
    PostingDate: '2026-03-25',
  })
  assert.deepEqual([r.status, r.message],
    [400, 'Stock of M-100 is 50, the sale needs 60'])
})

test('a sale for the profit center EX-WHOLE', async () => {
  await act('postSale', {
    Material: 'M-100', Quantity: 10, NetPrice: 11, Customer: 'C-3000',
    PostingDate: '2026-03-26', ProfitCenter: 'EX-WHOLE',
  })
  const { data } = await lab.GET(`${base}/DocumentItems?$filter=ProfitCenter eq 'EX-WHOLE'`)
  // 10 x 7.50 = 75.00 cost, 10 x 11.00 = 110.00 revenue
  assert.deepEqual(data.value.map((i) => [i.GLAccount, i.AmountInCompanyCodeCurrency]),
    [['600000', '75.00'], ['800000', '-110.00']])
})
