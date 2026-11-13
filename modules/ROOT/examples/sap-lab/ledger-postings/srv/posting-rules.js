// The posting rules of the teaching ledger: one function per business event.
// Each returns the lines of the document as { key, cents }, a debit positive
// and a credit negative. The G/L account of a line is found later, from the
// transaction key. Amounts are whole cents, so that the sums are exact.
export const cents = (amount) => Math.round(Number(amount) * 100)
export const money = (c) => (c / 100).toFixed(2)

// An illustrative tax rate of 19 percent, the same for input and output tax.
const tax = (net) => Math.round((net * 19) / 100)
const nonZero = (lines) => lines.filter((line) => line.cents !== 0)

// tag::goods-receipt[]
// Stock at the standard price, the offsetting entry at the order price, and
// the difference to the price difference account.
export function goodsReceipt({ quantity, price, standardPrice }) {
  const stock = quantity * cents(standardPrice)
  const received = quantity * cents(price)
  return nonZero([
    { key: 'BSX', cents: stock },
    { key: 'PRD', cents: received - stock },
    { key: 'WRX', cents: -received },
  ])
}
// end::goods-receipt[]

// The invoice clears GR/IR at the order price. A different invoice price goes
// to the price difference account. The supplier is credited with the gross.
export function invoiceReceipt({ quantity, price, invoicePrice }) {
  const net = quantity * cents(invoicePrice)
  const ordered = quantity * cents(price)
  const inputTax = tax(net)
  return nonZero([
    { key: 'WRX', cents: ordered },
    { key: 'PRD', cents: net - ordered },
    { key: 'INTAX', cents: inputTax },
    { key: 'VENDOR', cents: -(net + inputTax) },
  ])
}

export const vendorPayment = (amount) => [
  { key: 'VENDOR', cents: amount },
  { key: 'BANK', cents: -amount },
]

export const customerPayment = (amount) => [
  { key: 'BANK', cents: amount },
  { key: 'CUSTOMER', cents: -amount },
]

export const goodsIssue = ({ quantity, standardPrice }) => [
  { key: 'GBB', cents: quantity * cents(standardPrice) },
  { key: 'BSX', cents: -quantity * cents(standardPrice) },
]

export function billing({ quantity, netPrice }) {
  const net = quantity * cents(netPrice)
  const outputTax = tax(net)
  return [
    { key: 'CUSTOMER', cents: net + outputTax },
    { key: 'ERL', cents: -net },
    { key: 'OUTTAX', cents: -outputTax },
  ]
}
