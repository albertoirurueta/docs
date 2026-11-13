import cds from '@sap/cds'
export default class ExpenseService extends cds.ApplicationService {
  init() {
    this.before('SAVE', 'Claims', req => {
      if (req.data.amount < 0) req.error(400, 'Amount must not be negative', 'in/amount')
    })
    return super.init()
  }
}
