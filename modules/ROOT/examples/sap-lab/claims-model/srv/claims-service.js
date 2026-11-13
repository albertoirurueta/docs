import cds from '@sap/cds'

export default class ClaimsService extends cds.ApplicationService {
  init() {
    this.before(['CREATE', 'UPDATE'], 'Claims', validateClaim)
    // tag::hook[]
    this.on('submit', 'Claims', submitClaim)
    // end::hook[]
    return super.init()
  }
}

// Money is summed in whole cents so that the total is exact.
const cents = (amount) => Math.round(Number(amount) * 100)

function validateClaim(req) {
  const { title, items } = req.data
  if (req.event === 'CREATE' && !title?.trim()) {
    req.error(400, 'A claim needs a title', 'in/title')
  }
  if (items === undefined) return
  if (items.length === 0) {
    req.error(400, 'A claim needs at least one item', 'in/items')
  }
  for (const item of items) {
    if (!(cents(item.amount) > 0)) {
      const name = item.description
      req.error(400, `Item "${name}" needs an amount above zero`, 'in/items')
    }
  }
  const sum = items.reduce((total, item) => total + cents(item.amount), 0)
  req.data.total = (sum / 100).toFixed(2)
}

// tag::submit[]
async function submitClaim(req) {
  const { Claims } = this.entities
  const claim = await SELECT.one.from(req.subject)
  if (!claim) return req.reject(404, 'Claim not found')
  if (claim.status !== 'N') {
    const message = `Claim is already submitted (status ${claim.status})`
    return req.reject(409, message)
  }
  await UPDATE(Claims, claim.ID).with({ status: 'S' })
  return SELECT.one.from(Claims, claim.ID)
}
// end::submit[]
