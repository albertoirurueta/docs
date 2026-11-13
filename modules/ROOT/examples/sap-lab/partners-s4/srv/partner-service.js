import cds from '@sap/cds'

export default class PartnerDashboard extends cds.ApplicationService {
  async init() {
    const bupa = await cds.connect.to('API_BUSINESS_PARTNER')
    this.on('READ', 'Partners', req => bupa.run(req.query))
    return super.init()
  }
}
