import cds from '@sap/cds'

export default class ClaimsService extends cds.ApplicationService {
  init() {
    this.on('approve', 'Claims', async req => {
      const { ID } = req.params[0]
      await UPDATE('sap.guide.secured.Claims', ID).with({ status: 'A' })
    })
    return super.init()
  }
}
