import cds from '@sap/cds'
import { check, schedule } from './schedule.js'

export default class DepreciationService extends cds.ApplicationService {
  init() {
    const { Assets } = this.entities

    // Unbound function: the caller gives the method and the numbers.
    this.on('calculate', (req) => {
      const { Method: method, Base: base, Years: years, Factor: factor } = req.data
      const problem = check({ method, base, years, factor })
      if (problem) return req.error(400, problem)
      return schedule({ method, base, years, factor })
    })

    // Bound function: the numbers come from the asset master record.
    this.on('plan', Assets, async (req) => {
      const asset = await SELECT.one.from(Assets).where(req.params[0])
      if (!asset) return req.error(404, 'Asset not found')
      const input = {
        method: asset.Method,
        base: asset.AcquisitionCost,
        years: asset.UsefulLife,
        factor: asset.Factor,
      }
      const problem = check(input)
      if (problem) return req.error(400, problem)
      return schedule(input)
    })

    return super.init()
  }
}
