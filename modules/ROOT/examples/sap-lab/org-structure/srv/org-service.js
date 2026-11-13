import cds from '@sap/cds'

const key = (type, id) => `${type} ${id}`

export default class OrgService extends cds.ApplicationService {
  init() {
    const { Objects, RelationshipTypes, Relationships, EvaluationSteps } =
      this.entities

    // The relationship records that leave one object, of one kind, to one type.
    const follow = (relationship, fromType, fromId, toType) =>
      SELECT.from(Relationships).where({
        Relationship: relationship, SourceType: fromType, SourceId: fromId,
        TargetType: toType })
    const nameOf = async (type, id) =>
      (await SELECT.one.from(Objects)
        .where({ ObjectType: type, ObjectId: id }))?.Name

    // tag::rules[]
    // A relationship is checked against its definition. Then it is stored
    // from both ends: the other end is written after the record itself.
    this.before('CREATE', Relationships, async (req) => {
      const r = req.data
      const from = key(r.SourceType, r.SourceId)
      const to = key(r.TargetType, r.TargetId)
      const type = await SELECT.one.from(RelationshipTypes)
        .where({ Relationship: r.Relationship })
      if (!type) {
        return req.error(400, `Relationship ${r.Relationship} is not defined`)
      }
      if (r.SourceType !== type.SourceType || r.TargetType !== type.TargetType) {
        return req.error(400, `Relationship ${r.Relationship} links `
          + `${type.SourceType} to ${type.TargetType}, `
          + `not ${r.SourceType} to ${r.TargetType}`)
      }
      const ends = [[r.SourceType, r.SourceId], [r.TargetType, r.TargetId]]
      for (const [t, id] of ends) {
        if (!(await nameOf(t, id))) {
          return req.error(400, `Object ${key(t, id)} does not exist`)
        }
      }
      const same = await SELECT.one.from(Relationships).where({
        Relationship: r.Relationship, SourceType: r.SourceType,
        SourceId: r.SourceId, TargetType: r.TargetType, TargetId: r.TargetId })
      if (same) {
        return req.error(400,
          `Relationship ${r.Relationship} from ${from} to ${to} already exists`)
      }
      // Units form a tree: a unit never reports to itself or to a unit below it.
      if (r.Relationship === 'A002' || r.Relationship === 'B002') {
        const [lower, higher] = r.Relationship === 'A002'
          ? [r.SourceId, r.TargetId] : [r.TargetId, r.SourceId]
        for (let up = higher; up; ) {
          if (up === lower) {
            return req.error(400, `Unit ${lower} cannot report to `
              + `${higher}, which is not above it`)
          }
          up = (await follow('A002', 'O', up, 'O'))[0]?.TargetId
        }
      }
      // A unit has one chief position.
      if (r.Relationship === 'A012' || r.Relationship === 'B012') {
        const [position, unit] = r.Relationship === 'A012'
          ? [r.SourceId, r.TargetId] : [r.TargetId, r.SourceId]
        const chief = (await SELECT.from(Relationships).where({
          Relationship: 'A012', TargetType: 'O', TargetId: unit }))[0]
        if (chief && chief.SourceId !== position) {
          return req.error(400,
            `Unit ${unit} already has the chief position ${chief.SourceId}`)
        }
      }
    })
    this.after('CREATE', Relationships, async (_, req) => {
      const r = req.data
      const { Inverse } = await SELECT.one.from(RelationshipTypes)
        .where({ Relationship: r.Relationship })
      await INSERT.into(Relationships).entries({
        Relationship: Inverse, SourceType: r.TargetType, SourceId: r.TargetId,
        TargetType: r.SourceType, TargetId: r.SourceId })
      req.info(`Relationship ${r.Relationship} was stored with `
        + `its inverse ${Inverse}`)
    })
    // end::rules[]

    // tag::queries[]
    // An evaluation path, row by row: row 1 starts at the start object, each
    // next row starts at what the row before found. A row from a type to the
    // same type (O B002 O) is followed until nothing new turns up, and keeps
    // its start objects.
    this.on('evaluate', async (req) => {
      const { startType, startId, path } = req.data
      const rows = await SELECT.from(EvaluationSteps)
        .where({ Path_Path: path }).orderBy('Row')
      if (!rows.length) {
        return req.error(404, `The evaluation path ${path} is not defined`)
      }
      if (!(await nameOf(startType, startId))) {
        return req.error(404, `Object ${key(startType, startId)} does not exist`)
      }
      if (startType !== rows[0].FromType) {
        return req.error(400, `The path ${path} starts at `
          + `${rows[0].FromType} objects, not at ${startType} objects`)
      }
      const seen = new Set([key(startType, startId)])
      const result = []
      let frontier = [{ type: startType, id: startId }]
      for (const row of rows) {
        const sameType = row.FromType === row.ToType
        const from = frontier.filter((o) => o.type === row.FromType)
        const found = sameType ? [...from] : []
        for (let todo = from; todo.length; ) {
          const level = []
          for (const o of todo) {
            const links = await follow(row.Relationship, o.type, o.id, row.ToType)
            for (const link of links) {
              const id = key(link.TargetType, link.TargetId)
              if (seen.has(id)) continue
              seen.add(id)
              level.push({ type: link.TargetType, id: link.TargetId })
            }
          }
          found.push(...level)
          todo = sameType ? level : []
        }
        found.forEach((o) => result.push({ Step: row.Row, o }))
        frontier = found
      }
      return Promise.all(result.map(async ({ Step, o }) => ({
        Step, ObjectType: o.type, ObjectId: o.id,
        Name: await nameOf(o.type, o.id) })))
    })

    // The tree of a unit: its positions with their holders, then the units
    // below it, each one indented by its level.
    this.on('tree', async (req) => {
      const out = []
      const node = async (level, type, id, chief = false) =>
        out.push({ Level: level, ObjectType: type, ObjectId: id,
          Name: await nameOf(type, id), Chief: chief })
      const ids = async (relationship, type, id, toType) =>
        (await follow(relationship, type, id, toType)).map((r) => r.TargetId).sort()
      const walk = async (unit, level) => {
        const [chief] = await ids('B012', 'O', unit, 'S')
        await node(level, 'O', unit)
        for (const position of await ids('B003', 'O', unit, 'S')) {
          await node(level + 1, 'S', position, position === chief)
          for (const person of await ids('A008', 'S', position, 'P')) {
            await node(level + 2, 'P', person)
          }
        }
        for (const below of await ids('B002', 'O', unit, 'O')) {
          await walk(below, level + 1)
        }
      }
      if (!(await nameOf('O', req.data.startId))) {
        return req.error(404, `Object O ${req.data.startId} does not exist`)
      }
      await walk(req.data.startId, 0)
      return out
    })
    // end::queries[]

    return super.init()
  }
}
