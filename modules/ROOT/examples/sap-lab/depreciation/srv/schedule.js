// The depreciation rules of the teaching model. Amounts are whole cents, so
// that the sums are exact; the last year takes what the rounding left over.
export const METHODS = ['straight-line', 'remaining-life', 'declining-balance']

export const toCents = (amount) => Math.round(Number(amount) * 100)
export const money = (cents) => (cents / 100).toFixed(2)

// Depreciation = APC / useful life (straight-line over the total life) and
// Depreciation = net book value / remaining life (from the book value) are the
// same division; the base is the APC in one case and the book value in the other.
export const evenAmount = (baseCents, years) => Math.round(baseCents / years)

// Depreciation = net book value * (100% / useful life * factor)
export const decliningAmount = (nbvCents, years, factor) =>
  Math.round((nbvCents * factor) / years)

export function check({ method, base, years, factor }) {
  if (!METHODS.includes(method)) {
    return `Unknown method ${method}; use ${METHODS.join(', ')}`
  }
  if (!(Number(base) > 0)) return 'Base must be greater than zero'
  if (!Number.isInteger(years) || years < 1) {
    return 'Years must be a whole number of at least 1'
  }
  if (method === 'declining-balance' && !(Number(factor) > 0)) {
    return 'The declining-balance method needs a Factor greater than zero'
  }
}

export function schedule({ method, base, years, factor }) {
  const apc = toCents(base)
  const rows = []
  let nbv = apc
  let changed = false
  for (let year = 1; year <= years; year++) {
    const remaining = years - year + 1
    let amount = evenAmount(nbv, remaining)
    let rule = 'straight-line'
    if (method === 'remaining-life') rule = 'remaining-life'
    if (method === 'declining-balance') {
      const declining = decliningAmount(nbv, years, factor)
      // Changeover: once the declining amount is lower than the straight-line
      // amount of the APC, the book value is spread over the remaining years.
      if (!changed && declining < evenAmount(apc, years)) changed = true
      if (changed) rule = 'changeover'
      else [amount, rule] = [declining, 'declining']
    }
    if (year === years) amount = nbv
    nbv -= amount
    rows.push({
      Year: year,
      Depreciation: money(amount),
      AccumulatedDepreciation: money(apc - nbv),
      NetBookValue: money(nbv),
      Rule: rule,
    })
  }
  return rows
}
