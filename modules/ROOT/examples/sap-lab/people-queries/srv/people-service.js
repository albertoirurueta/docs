import cds from '@sap/cds'

const DATE = /^\d{4}-\d{2}-\d{2}$/

// A date as YYYY-MM-DD that is a real calendar day (2026-02-30 is not).
const isDate = (text) =>
  DATE.test(text) && new Date(`${text}T00:00:00Z`).toISOString().startsWith(text)

// Today as YYYY-MM-DD in UTC.
const today = () => new Date().toISOString().slice(0, 10)

export default class PeopleService extends cds.ApplicationService {
  init() {
    const { OrganizationalAssignments, BasicPayRecords, ParkingPermits } =
      this.entities
    const effectiveDated =
      [OrganizationalAssignments, BasicPayRecords, ParkingPermits]

    // tag::dates[]
    // The model's own parameters, written like the ones of the SuccessFactors
    // API: asOfDate alone, or fromDate together with toDate, never both. They
    // are not OData system options, so they have no dollar sign.
    this.before('READ', effectiveDated, (req) => {
      if (req.query.SELECT.one) return // a read by key asks for that record
      const { asOfDate, fromDate, toDate } = req.http.req.query
      for (const [name, value] of Object.entries({ asOfDate, fromDate, toDate })) {
        if (value !== undefined && !isDate(value)) {
          return req.error(400, `${name} must be a date written YYYY-MM-DD`)
        }
      }
      if (asOfDate && (fromDate || toDate)) {
        return req.error(400, 'Use asOfDate or fromDate with toDate, not both')
      }
      if (Boolean(fromDate) !== Boolean(toDate)) {
        return req.error(400, 'fromDate and toDate must be used together')
      }
      if (fromDate > toDate) {
        return req.error(400, 'fromDate must not be after toDate')
      }
      // A record is effective on a date when BeginDate <= date <= EndDate.
      if (fromDate) {
        // A range returns every record that is effective on one day or more
        // of it: the record begins on or before toDate and ends on or after
        // fromDate.
        req.query.where({
          BeginDate: { '<=': toDate },
          EndDate: { '>=': fromDate },
        })
      } else {
        const date = asOfDate ?? today() // no parameter means today
        req.query.where({
          BeginDate: { '<=': date },
          EndDate: { '>=': date },
        })
      }
    })
    // end::dates[]

    return super.init()
  }
}
