import cds from '@sap/cds'
import * as rules from './posting-rules.js'

const { cents, money } = rules
const db = cds.entities('sap.guide.ledgerpostings')
const { Documents, DocumentItems, AccountDetermination } = db
const { Materials, PurchaseOrders } = db

// These keys look their account up by the valuation class of the material.
const BY_CLASS = ['BSX', 'PRD', 'WRX', 'GBB']

export default class LedgerPostingsService extends cds.ApplicationService {
  init() {
    this.on('postGoodsReceipt', goodsReceipt)
    this.on('postInvoiceReceipt', invoiceReceipt)
    this.on('payVendor', payVendor)
    this.on('postSale', sale)
    this.on('receiveCustomerPayment', customerPayment)
    this.on('clearOpenItems', clearOpenItems)
    return super.init()
  }
}

async function goodsReceipt(req) {
  const { PurchaseOrder, Quantity, PostingDate } = req.data
  const { po, material } = await order(req, PurchaseOrder)
  const open = po.Quantity - po.ReceivedQuantity
  if (Quantity > open) {
    return req.reject(400, `${PurchaseOrder} has only ${open} pieces open`)
  }
  const lines = rules.goodsReceipt({
    quantity: Quantity,
    price: po.Price,
    standardPrice: material.StandardPrice,
  })
  await UPDATE(PurchaseOrders, PurchaseOrder).with({
    ReceivedQuantity: po.ReceivedQuantity + Quantity,
  })
  await UPDATE(Materials, material.ID).with({
    StockQuantity: material.StockQuantity + Quantity,
  })
  const text = `Goods receipt ${PurchaseOrder}`
  const refs = { Reference: PurchaseOrder, Class: material.ValuationClass }
  return post(req, 'WE', PostingDate, text, lines, refs)
}

async function invoiceReceipt(req) {
  const { PurchaseOrder, Quantity, InvoicePrice, PostingDate } = req.data
  const { po, material } = await order(req, PurchaseOrder)
  if (Quantity > po.Quantity - po.InvoicedQuantity) {
    return req.reject(400, `${PurchaseOrder} has fewer pieces left to invoice`)
  }
  const lines = rules.invoiceReceipt({
    quantity: Quantity,
    price: po.Price,
    invoicePrice: InvoicePrice,
  })
  await UPDATE(PurchaseOrders, PurchaseOrder).with({
    InvoicedQuantity: po.InvoicedQuantity + Quantity,
  })
  const text = `Invoice ${PurchaseOrder}`
  const refs = {
    Reference: PurchaseOrder,
    Partner: po.Supplier,
    Class: material.ValuationClass,
  }
  return post(req, 'RE', PostingDate, text, lines, refs)
}

async function payVendor(req) {
  const { Document, PostingDate } = req.data
  const item = await SELECT.one.from(DocumentItems).where({
    Document_DocumentNumber: Document,
    TransactionKey: 'VENDOR',
  })
  if (!item) return req.reject(404, `Document ${Document} has no supplier line`)
  const lines = rules.vendorPayment(-cents(item.AmountInCompanyCodeCurrency))
  const refs = { Reference: Document, Partner: item.Partner }
  return post(req, 'KZ', PostingDate, `Payment of ${Document}`, lines, refs)
}

async function sale(req) {
  const { Material, Quantity, NetPrice, Customer, PostingDate } = req.data
  const material = await SELECT.one.from(Materials, Material)
  if (!material) return req.reject(404, `Material ${Material} not found`)
  if (Quantity > material.StockQuantity) {
    const stock = `Stock of ${Material} is ${material.StockQuantity}`
    return req.reject(400, `${stock}, the sale needs ${Quantity}`)
  }
  await UPDATE(Materials, Material).with({
    StockQuantity: material.StockQuantity - Quantity,
  })
  const refs = {
    ProfitCenter: req.data.ProfitCenter ?? 'EX-RETAIL',
    Class: material.ValuationClass,
    Partner: Customer,
  }
  const issue = rules.goodsIssue({
    quantity: Quantity,
    standardPrice: material.StandardPrice,
  })
  await post(req, 'WA', PostingDate, `Goods issue ${Material}`, issue, refs)
  const bill = rules.billing({ quantity: Quantity, netPrice: NetPrice })
  return post(req, 'RV', PostingDate, `Billing ${Customer}`, bill, refs)
}

async function customerPayment(req) {
  const { Customer, Amount, PostingDate } = req.data
  const lines = rules.customerPayment(cents(Amount))
  const text = `Payment of ${Customer}`
  return post(req, 'DZ', PostingDate, text, lines, { Partner: Customer })
}

async function order(req, id) {
  const po = await SELECT.one.from(PurchaseOrders, id)
  if (!po) return req.reject(404, `Purchase order ${id} not found`)
  const material = await SELECT.one.from(Materials, po.Material_ID)
  return { po, material }
}

// tag::post[]
// Finds the G/L account of every line from its transaction key, checks that
// the document balances, numbers it and stores it with its lines.
async function post(req, type, date, text, lines, refs) {
  const items = []
  for (const line of lines) {
    const ValuationClass = BY_CLASS.includes(line.key) ? refs.Class : '-'
    const found = await SELECT.one.from(AccountDetermination)
      .where({ TransactionKey: line.key, ValuationClass })
    if (!found) {
      return req.reject(400, `No account is determined for key ${line.key}`)
    }
    items.push({
      ItemNumber: items.length + 1,
      TransactionKey: line.key,
      GLAccount: found.GLAccount,
      ProfitCenter: ['GBB', 'ERL'].includes(line.key) ? refs.ProfitCenter : null,
      Partner: ['VENDOR', 'CUSTOMER'].includes(line.key) ? refs.Partner : null,
      Reference: refs.Reference ?? null,
      AmountInCompanyCodeCurrency: money(line.cents),
    })
  }
  const sum = lines.reduce((total, line) => total + line.cents, 0)
  if (sum !== 0) return req.reject(500, `Not balanced by ${money(sum)}`)
  const { count } = await SELECT.one`count(*) as count`.from(Documents)
  const DocumentNumber = String(100000001 + count)
  await INSERT.into(Documents).entries({
    DocumentNumber,
    DocumentType: type,
    PostingDate: date,
    Description: text,
    Items: items,
  })
  return SELECT.one.from(Documents, DocumentNumber)
}
// end::post[]

// tag::clear[]
// Clears the open items of one account that add up to zero. The clearing
// document is the number of the latest document that takes part.
async function clearOpenItems(req) {
  const { GLAccount, Partner, Reference, ClearingDate } = req.data
  const where = { GLAccount, ClearingDocument: null }
  if (Partner) where.Partner = Partner
  if (Reference) where.Reference = Reference
  const items = await SELECT.from(DocumentItems).where(where)
  const amounts = items.map((i) => cents(i.AmountInCompanyCodeCurrency))
  const debits = amounts.filter((c) => c > 0).reduce((t, c) => t + c, 0)
  const credits = -amounts.filter((c) => c < 0).reduce((t, c) => t + c, 0)
  if (items.length < 2 || debits !== credits) {
    const message = `debits ${money(debits)}, credits ${money(credits)}`
    return req.reject(400, `Items do not add up to zero: ${message}`)
  }
  const numbers = items.map((i) => i.Document_DocumentNumber)
  const ClearingDocument = numbers.sort().at(-1)
  await UPDATE(DocumentItems).set({ ClearingDocument, ClearingDate }).where(where)
  return { ClearingDocument, ClearedItems: items.length }
}
// end::clear[]
