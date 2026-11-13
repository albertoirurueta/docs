import cds from '@sap/cds'

const HIGH_DATE = '9999-12-31'

// The day before a date, as YYYY-MM-DD (UTC, so daylight saving time cannot
// move the date).
const dayBefore = (date) => {
  const d = new Date(`${date}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() - 1)
  return d.toISOString().slice(0, 10)
}

export default class PeopleService extends cds.ApplicationService {
  init() {
    const { OrganizationalAssignments, BasicPayRecords, ParkingPermits } =
      this.entities
    const timeConstraint1 = [OrganizationalAssignments, BasicPayRecords]
    const timeConstraint2 = [ParkingPermits]

    // Creating a record ends the record that is valid on its start date: the
    // end date of the old record becomes the new start date minus one day.
    const delimitOnCreate = (entity) => async (req) => {
      const record = req.data
      const who = record.Employee_PersonnelNumber
      record.EndDate ??= HIGH_DATE
      if (record.EndDate < record.BeginDate) {
        return req.error(400, 'The end date must not be before the begin date',
          'in/EndDate')
      }
      const latest = await SELECT.one.from(entity)
        .where({ Employee_PersonnelNumber: who })
        .orderBy('BeginDate desc')
      if (!latest) return
      if (record.BeginDate <= latest.BeginDate) {
        return req.error(400,
          `A record from ${latest.BeginDate} already exists; add records after it`,
          'in/BeginDate')
      }
      if (latest.EndDate >= record.BeginDate) {
        const end = dayBefore(record.BeginDate)
        await UPDATE(entity).set({ EndDate: end })
          .where({ Employee_PersonnelNumber: who, BeginDate: latest.BeginDate })
        req.info(`The record from ${latest.BeginDate} was delimited to ${end}`)
      }
    }
    for (const entity of [...timeConstraint1, ...timeConstraint2]) {
      this.before('CREATE', entity, delimitOnCreate(entity))
    }

    // Time constraint 1: a record must exist at all times, so it cannot be
    // deleted.
    for (const entity of timeConstraint1) {
      this.before('DELETE', entity, (req) =>
        req.error(400, 'A record with time constraint 1 cannot be deleted'))
    }

    return super.init()
  }
}
