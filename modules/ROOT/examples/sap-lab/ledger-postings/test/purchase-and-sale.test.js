import { test } from 'node:test'
import assert from 'node:assert'
import { act, base, lab, lines, balances, openItems } from './helpers.js'

// One story in order: a purchase, a sale, and the cleared open items.
test('goods receipt posts stock, price difference and GR/IR', async () => {
  const { data } = await act('postGoodsReceipt', {
    PurchaseOrder: 'PO-1', Quantity: 50, PostingDate: '2026-03-03',
  })
  assert.equal(data.DocumentNumber, '100000001')
  // 50 x 7.50 = 375.00, 50 x 8.00 = 400.00, 400.00 - 375.00 = 25.00
  assert.deepEqual(await lines('100000001'), [
    ['BSX', '140000', '375.00'],
    ['PRD', '140900', '25.00'],
    ['WRX', '231000', '-400.00'],
  ])
})

test('invoice receipt clears GR/IR at the order value and credits the supplier', async () => {
  await act('postInvoiceReceipt', {
    PurchaseOrder: 'PO-1', Quantity: 50, InvoicePrice: 8.2, PostingDate: '2026-03-10',
  })
  // 50 x 8.20 = 410.00, tax 410.00 x 0.19 = 77.90, gross 487.90
  assert.deepEqual(await lines('100000002'), [
    ['WRX', '231000', '400.00'],
    ['PRD', '140900', '10.00'],
    ['INTAX', '154000', '77.90'],
    ['VENDOR', '160000', '-487.90'],
  ])
  const open = await openItems()
  assert.equal(open.length, 3)
})

test('payment and clearing close the supplier and GR/IR items', async () => {
  await act('payVendor', { Document: '100000002', PostingDate: '2026-03-20' })
  assert.deepEqual(await lines('100000003'), [
    ['VENDOR', '160000', '487.90'],
    ['BANK', '113100', '-487.90'],
  ])
  const gr = await act('clearOpenItems', {
    GLAccount: '231000', Reference: 'PO-1', ClearingDate: '2026-03-10',
  })
  assert.deepEqual([gr.data.ClearingDocument, gr.data.ClearedItems], ['100000002', 2])
  const su = await act('clearOpenItems', {
    GLAccount: '160000', Partner: 'V-1000', ClearingDate: '2026-03-20',
  })
  assert.deepEqual([su.data.ClearingDocument, su.data.ClearedItems], ['100000003', 2])
  assert.equal((await openItems()).length, 0)
})

test('a sale posts the goods issue and the billing document', async () => {
  const { data } = await act('postSale', {
    Material: 'M-100', Quantity: 40, NetPrice: 12.5, Customer: 'C-2000',
    PostingDate: '2026-03-25',
  })
  assert.equal(data.DocumentNumber, '100000005')
  // 40 x 7.50 = 300.00
  assert.deepEqual(await lines('100000004'), [
    ['GBB', '600000', '300.00'],
    ['BSX', '140000', '-300.00'],
  ])
  // 40 x 12.50 = 500.00, tax 95.00, gross 595.00
  assert.deepEqual(await lines('100000005'), [
    ['CUSTOMER', '121000', '595.00'],
    ['ERL', '800000', '-500.00'],
    ['OUTTAX', '260000', '-95.00'],
  ])
  const { data: m } = await lab.GET(`${base}/Materials('M-100')`)
  assert.equal(m.StockQuantity, 10)
})

test('the customer payment is cleared against the invoice', async () => {
  assert.equal((await openItems()).length, 1)
  await act('receiveCustomerPayment', {
    Customer: 'C-2000', Amount: 595, PostingDate: '2026-04-02',
  })
  assert.deepEqual(await lines('100000006'), [
    ['BANK', '113100', '595.00'],
    ['CUSTOMER', '121000', '-595.00'],
  ])
  const c = await act('clearOpenItems', {
    GLAccount: '121000', Partner: 'C-2000', ClearingDate: '2026-04-02',
  })
  assert.deepEqual([c.data.ClearingDocument, c.data.ClearedItems], ['100000006', 2])
  assert.equal((await openItems()).length, 0)
})

test('the balances of the ledger after the story', async () => {
  const b = await balances()
  const expected = {
    113100: ['595.00', '487.90', '107.10'],
    121000: ['595.00', '595.00', '0.00'],
    140000: ['375.00', '300.00', '75.00'],
    140900: ['35.00', '0.00', '35.00'],
    154000: ['77.90', '0.00', '77.90'],
    160000: ['487.90', '487.90', '0.00'],
    231000: ['400.00', '400.00', '0.00'],
    260000: ['0.00', '95.00', '-95.00'],
    600000: ['300.00', '0.00', '300.00'],
    800000: ['0.00', '500.00', '-500.00'],
  }
  for (const [account, [debits, credits, balance]] of Object.entries(expected)) {
    assert.deepEqual([b[account].Debits, b[account].Credits, b[account].Balance],
      [debits, credits, balance], account)
  }
  // The ledger balances: all debits equal all credits (2,865.80).
  const total = (field) => Object.values(b).reduce((t, x) => t + Math.round(x[field] * 100), 0)
  assert.equal(total('Debits'), 286580)
  assert.equal(total('Debits'), total('Credits'))
  // The stock account holds the 10 pieces left at the standard price 7.50.
  assert.equal(b[140000].Balance, '75.00')
})
