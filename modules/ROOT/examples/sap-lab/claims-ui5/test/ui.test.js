import { test } from 'node:test'
import assert from 'node:assert'
import { readFileSync } from 'node:fs'
const dir = import.meta.dirname + '/../ui/webapp/'
const app = (f) => readFileSync(dir + f, 'utf8')
const keys = (f) => Object.fromEntries(app(f).split('\n')
  .filter((l) => l.includes('=')).map((l) => l.split('=')))
test('every i18n key of the view and controller is in both files', () => {
  const used = new Set(['statusN', 'statusA', 'statusR'])
  for (const f of ['view/Claims.view.xml', 'controller/Claims.controller.js']) {
    for (const m of app(f).matchAll(/i18n>(\w+)|getText\("(\w+)"[,)]/g)) {
      used.add(m[1] ?? m[2])
    }
  }
  for (const f of ['i18n/i18n_en.properties', 'i18n/i18n_de.properties']) {
    for (const k of used) assert.ok(k in keys(f), `${k} is missing in ${f}`)
  }
})
test('the manifest names the service that the CAP project serves', () => {
  const sources = JSON.parse(app('manifest.json'))['sap.app'].dataSources
  assert.strictEqual(sources.claimService.uri, '/odata/v4/claim/')
})
