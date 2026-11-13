import cds from '@sap/cds'
import assert from 'node:assert'

export const base = '/odata/v4/ledger-postings'
export const lab = cds.test(import.meta.dirname + '/..')

export const act = (name, body) => lab.POST(`${base}/${name}`, body)

// The answer of a rejected action, as { status, message }.
export async function rejected(name, body) {
  try {
    await act(name, body)
  } catch (e) {
    const r = e.response ?? e
    return { status: r.status, message: r.data.error.message }
  }
  assert.fail(`${name} should be rejected`)
}

// The lines of a document as [key, account, amount] rows.
export async function lines(number) {
  const query = `$filter=Document_DocumentNumber eq '${number}'`
  const { data } = await lab.GET(`${base}/DocumentItems?${query}`)
  return data.value.map((i) => [
    i.TransactionKey,
    i.GLAccount,
    i.AmountInCompanyCodeCurrency,
  ])
}

export const balances = async () => {
  const { data } = await lab.GET(`${base}/AccountBalances`)
  return Object.fromEntries(data.value.map((b) => [b.GLAccount, b]))
}

export const openItems = async () => {
  const { data } = await lab.GET(`${base}/OpenItems`)
  return data.value
}
