import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, cpSync, rmSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { auditPage, collectPages, glossaryAnchors, introWords, isExempt, keyTermItems, sections } from './audit-beginner.mjs'

const fx = (name) => fileURLToPath(new URL(`./fixtures/${name}`, import.meta.url))
const script = fileURLToPath(new URL('./audit-beginner.mjs', import.meta.url))

test('a page with intro, key terms with glossary links and a summary passes', () => {
  assert.deepEqual(auditPage(fx('passing.adoc')), [])
})

test('a failing page reports each missing piece', () => {
  const problems = auditPage(fx('failing.adoc'))
  assert.ok(problems.some((p) => p.includes('plain-words introduction')))
  assert.ok(problems.some((p) => p.includes('missing "== Summary"')))
  assert.ok(problems.some((p) => p.includes('key term 1') && p.includes('no glossary link')))
  assert.ok(problems.some((p) => p.includes('key term 2') && p.includes('#missing-anchor')))
})

test('a page without a Key terms section is reported', () => {
  const text = fx('passing.adoc')
  const stripped = `= T\n\n${'word '.repeat(30)}\n\n== Summary\n\nDone.\n`
  assert.ok(auditPage(text, stripped).some((p) => p.includes('missing "== Key terms"')))
})

test('headings inside listing blocks are not sections', () => {
  const titles = sections('intro\n\n----\n== Key terms\n----\n\n== Summary\n\nx\n').map((s) => s.title)
  assert.deepEqual(titles, [null, 'Summary'])
})

test('introWords ignores attributes, includes, comments and list markers', () => {
  const words = introWords([':description: not counted here', 'include::partial$x.adoc[]', '// comment words', '* list item words', 'Three plain words.'])
  assert.equal(words, 3)
})

test('keyTermItems joins continuation lines', () => {
  assert.deepEqual(keyTermItems(['* first', '  continued', '', '* second']), ['first continued', 'second'])
})

test('glossaryAnchors reads explicit anchors and automatic section ids', () => {
  const ids = glossaryAnchors(fx('glossary.adoc'))
  assert.ok(ids.has('internal-table') && ids.has('work-area') && ids.has('_data_object'))
})

test('guides, indexes, glossaries, cheat sheets and bibliographies are exempt', () => {
  for (const name of ['index.adoc', 'guide-first-abap-program.adoc', 'glossary.adoc', 'glossary-abap.adoc', 'cheat-sheet.adoc', 'bibliography.adoc']) {
    assert.ok(isExempt(name), name)
  }
  assert.ok(!isExempt('internal-tables.adoc'))
})

test('collectPages skips exempt names and walks subdirectories', () => {
  const dir = mkdtempSync(join(tmpdir(), 'audit-beginner-'))
  try {
    mkdirSync(join(dir, 'sub'))
    for (const f of ['index.adoc', 'guide-x.adoc', 'page.adoc', 'sub/other.adoc', 'glossary.adoc']) writeFileSync(join(dir, f), '= T\n')
    const names = collectPages([dir]).map((p) => p.slice(dir.length + 1)).sort()
    assert.deepEqual(names, ['page.adoc', 'sub/other.adoc'])
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('the command line exits 0 for a passing directory and 1 for a failing one', () => {
  const dir = mkdtempSync(join(tmpdir(), 'audit-beginner-cli-'))
  const name = dir
  try {
    cpSync(fx('glossary.adoc'), join(dir, 'glossary.adoc'))
    cpSync(fx('passing.adoc'), join(dir, 'passing.adoc'))
    assert.equal(spawnSync('node', [script, '--dir', name]).status, 0)
    cpSync(fx('failing.adoc'), join(dir, 'failing.adoc'))
    const run = spawnSync('node', [script, '--dir', name], { encoding: 'utf8' })
    assert.equal(run.status, 1)
    assert.match(run.stdout, /failing\.adoc/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('the shared page template passes the audit', () => {
  assert.deepEqual(auditPage(fileURLToPath(new URL('./page-template.adoc', import.meta.url))), [])
})

test('the guide template has the guide headings in order', () => {
  const titles = sections(readFileSync(fileURLToPath(new URL('./guide-template.adoc', import.meta.url)), 'utf8')).slice(1).map((s) => s.title)
  const expected = ['What you build', 'Before you start', 'Steps', 'Check the result', 'Variations', 'What can go wrong', 'Clean up', 'Where to go next', 'Sources']
  assert.deepEqual(titles, expected)
})
