// Runs the QUnit and OPA5 tests in a local headless Chrome.
// Exits with 1 when a test fails.
import { spawn, execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'

const port = 8767
const base = `http://localhost:${port}/test/Test.qunit.html`
const suite = 'test-resources/guide/claims/testsuite.qunit'
const tests = ['unit/Main', 'integration/opaTests']

const chrome = [
  process.env.CHROME_BIN,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium'
].find(p => p && existsSync(p))
if (!chrome) {
  console.error('Chrome not found: set CHROME_BIN')
  process.exit(1)
}

const args = ['ui5', 'serve', '--port', String(port)]
const server = spawn('npx', args, { stdio: ['ignore', 'ignore', 'pipe'] })
let serverLog = ''
server.stderr.on('data', d => { serverLog += d })
process.on('exit', () => server.kill())

async function waitForServer() {
  for (let i = 0; i < 100; i++) {
    try { if ((await fetch(base)).ok) return } catch { /* not up yet */ }
    await new Promise(r => setTimeout(r, 300))
  }
  console.error(serverLog)
  throw new Error('ui5 serve did not start')
}

function resultOf(name) {
  const url = `${base}?testsuite=${suite}&test=${name}`
  const flags = ['--headless=new', '--disable-gpu', '--virtual-time-budget=20000']
  const dom = execFileSync(chrome, [...flags, '--dump-dom', url], {
    encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore']
  })
  const m = dom.match(/id="qunit-testresult-display"[^>]*>([\s\S]*?)<\/p>/)
  return m ? m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : ''
}

await waitForServer()
let failed = false
const pattern =
  /(\d+) tests completed.* with (\d+) failed.*?(\d+) assertions of (\d+) passed/
for (const name of tests) {
  const m = resultOf(name).match(pattern)
  if (!m) { console.log(`${name}: no result found`); failed = true; continue }
  const [, count, bad, passed, total] = m
  console.log(`${name}: ${count} tests, ${bad} failed,`,
    `${passed} of ${total} assertions passed`)
  if (Number(bad) > 0 || Number(count) === 0) failed = true
}
process.exit(failed ? 1 : 0)
