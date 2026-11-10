#!/usr/bin/env node
// Traceability check for the disclaimer consolidation (#364, WP1).
// Maps each removed per-topic partial's non-AI content to its new location and fails when a version or caveat
// sentence has no destination. Reads scripts/disclaimers/relocation-map.json (written by relocate.mjs).
// Usage: node scripts/disclaimers/traceability.mjs [--ref <git-rev>] [--verbose]
//   --ref  also verify that every `*disclaimer*` partial present at that revision (default: none) is in the map.
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const pagesDir = join(root, 'modules/ROOT/pages')
const map = JSON.parse(readFileSync(join(root, 'scripts/disclaimers/relocation-map.json'), 'utf8'))
const verbose = process.argv.includes('--verbose')
const norm = s => s.replace(/\s+/g, ' ').trim()
const failures = []
const warnings = []

// 1. Every removed partial is accounted for.
const refIdx = process.argv.indexOf('--ref')
if (refIdx > 0) {
  const ref = process.argv[refIdx + 1]
  const listed = execFileSync('git', ['ls-tree', '--name-only', ref, 'modules/ROOT/partials/'], { cwd: root, encoding: 'utf8' })
    .split('\n').filter(f => f.includes('disclaimer')).map(f => f.split('/').pop())
  for (const f of listed) if (f !== 'ai-disclaimer.adoc' && !map.some(m => m.partial === f)) failures.push(`${f}: not in relocation map`)
}

// 2. Every version / caveat / other residual sentence is present in its destination page.
let checked = 0
const destText = new Map()
for (const m of map) {
  if (!m.residual.length) continue
  if (!m.destination) { failures.push(`${m.partial}: has non-AI content but no destination`); continue }
  const f = join(pagesDir, m.destination)
  if (!existsSync(f)) { failures.push(`${m.partial}: destination ${m.destination} missing`); continue }
  if (!destText.has(f)) destText.set(f, norm(readFileSync(f, 'utf8')))
  const text = destText.get(f)
  for (const r of m.residual) {
    checked++
    if (!text.includes(norm(r.text))) failures.push(`${m.partial} -> ${m.destination}: ${r.kind} sentence not found: "${r.text.slice(0, 80)}..."`)
  }
}

// 3. URLs only mentioned in dropped (AI / bibliography / verification) sentences: warn when absent from the
//    destination subsection (the official-documentation links are normally repeated in the version baseline).
const URL_RE = /https?:\/\/[^\s\[\]]+/g
for (const m of map) {
  const urls = new Set(m.dropped.flatMap(d => d.text.match(URL_RE) || []))
  if (!urls.size) continue
  const dest = m.destination || null
  const scan = dest ? norm(readFileSync(join(pagesDir, dest), 'utf8')) : ''
  for (const u of urls) if (!scan.includes(u.replace(/[.,;)]+$/, ''))) warnings.push(`${m.partial}: URL only in the dropped AI sentence: ${u}`)
}

// 4. No per-topic disclaimer include or partial survives, and the shared one is the only AI wording.
const left = readdirSync(join(root, 'modules/ROOT/partials')).filter(f => f.includes('disclaimer'))
if (left.length > 1 && process.argv.includes('--deleted')) failures.push(`partials still present: ${left.length}`)

console.log(`partials mapped: ${map.length}; with relocated content: ${map.filter(m => m.residual.length).length}; sentences checked: ${checked}`)
console.log(`dropped as AI/bibliography/verification pointer only: ${map.filter(m => !m.residual.length).length}`)
if (verbose) for (const m of map.filter(m => m.residual.length)) console.log(`  ${m.partial} -> ${m.destination} [${m.placement}] (${m.residual.length})`)
for (const w of warnings) console.log(`WARN ${w}`)
for (const f of failures) console.log(`FAIL ${f}`)
if (failures.length) { console.log(`${failures.length} failure(s)`); process.exit(1) }
console.log('traceability OK')
