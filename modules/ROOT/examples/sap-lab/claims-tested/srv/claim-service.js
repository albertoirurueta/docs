import cds from '@sap/cds'
export default class ClaimService extends cds.ApplicationService {
  init() {
    // tag::validate[]
    this.before(['CREATE', 'UPDATE'], 'Claims', req => {
      if (req.data.amount < 0) req.error(400, 'Amount must not be negative')
    })
    // end::validate[]
    return super.init()
  }
}
