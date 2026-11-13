import { test } from 'node:test'
import assert from 'node:assert'
import { goodsReceipt, invoiceReceipt } from '../srv/posting-rules.js'

// The worked example of the SAP Learning page "Describing Automatic Account
// Determination": 10 pieces, standard price 10, order price 12, invoice 110.
test('goods receipt: stock 100, price difference 20, GR/IR 120', () => {
  const lines = goodsReceipt({ quantity: 10, price: 12, standardPrice: 10 })
  assert.deepEqual(lines, [
    { key: 'BSX', cents: 10000 },
    { key: 'PRD', cents: 2000 },
    { key: 'WRX', cents: -12000 },
  ])
})

test('invoice: GR/IR cleared at 120, the gap of 10 goes to the difference', () => {
  const lines = invoiceReceipt({ quantity: 10, price: 12, invoicePrice: 11 })
  const [gr, difference] = lines
  assert.deepEqual(gr, { key: 'WRX', cents: 12000 })
  assert.deepEqual(difference, { key: 'PRD', cents: -1000 })
})
