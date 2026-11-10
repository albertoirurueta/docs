#!/usr/bin/env node
// Inventory of every `*disclaimer*` partial: its non-AI content, classified, and the pages that include it.
// Usage: node scripts/disclaimers/inventory.mjs [--json] [--out <file>]
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const partialsDir = join(root, 'modules/ROOT/partials')
const pagesDir = join(root, 'modules/ROOT/pages')

function walk (dir, acc = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    if (statSync(p).isDirectory()) walk(p, acc)
    else if (p.endsWith('.adoc')) acc.push(p)
  }
  return acc
}

const AI_RE = /generated with the assistance of AI/
const BIB_RE = /(bibliograph|reference material|consulted while preparing|#_(sources|references))/i
const VERSION_RE = /(\d+\.(\d+|x)|\bLTS\b|\bversion\b|release line|\bJava \d+|ISO\/IEC|RFC \d+|draft)/i
const CAVEAT_RE = /(legacy|not legal advice|not ASP\.NET|not tied to|vendor-neutral|linked,? (rather than|not)|frozen|security fixes|out of scope|in preview|Atlas-only|successor|default to|contrast|not a published standard|only editorially)/i

/** Strip the block delimiters and split the partial into sentences. */
export function sentences (text) {
  const body = text.replace(/^\[(IMPORTANT|NOTE)\]\n====\n/, '').replace(/\n====\s*$/, '')
  return body.replace(/\s+/g, ' ').trim().split(/(?<=[.!?])\s+(?=[A-Zj<*`])/).filter(Boolean)
}

/** Classify one sentence: ai | bibliography | verify | version | caveat | links | other. */
export function classify (s) {
  const hasLink = /https?:\/\/|xref:/.test(s)
  if (/^This content was generated with the assistance of AI and should be verified against /.test(s)) return 'ai'
  if (AI_RE.test(s) && !VERSION_RE.test(s.replace(AI_RE, '')) && !CAVEAT_RE.test(s)) return 'ai'
  if (/^Verify it against .* before relying on it in production\.$/.test(s)) return 'verify'
  if (BIB_RE.test(s) && /xref:|bibliograph|consulted/.test(s) && !/This section documents/.test(s)) return 'bibliography'
  if (/This (section|page) documents|is documented here as|^Verify it against/.test(s) && VERSION_RE.test(s)) return 'version'
  if (CAVEAT_RE.test(s)) return 'caveat'
  if (VERSION_RE.test(s)) return 'version'
  if (hasLink) return 'links'
  return 'other'
}

export function inventory (ref = null) {
  const partials = readdirSync(partialsDir).filter(f => f.includes('disclaimer')).sort()
  const includers = new Map(partials.map(p => [p, []]))
  const re = /include::partial\$([A-Za-z0-9._-]*disclaimer[A-Za-z0-9._-]*\.adoc)\[/g
  if (ref) {
    // Read the include lines from a git revision (used after the pages were switched to the shared partial).
    const out = execFileSync('git', ['grep', '-n', '-E', 'include::partial\\$[A-Za-z0-9._-]*disclaimer[A-Za-z0-9._-]*\\.adoc\\[', ref, '--', 'modules/ROOT/pages'], { cwd: root, encoding: 'utf8', maxBuffer: 1 << 28 })
    for (const line of out.split('\n')) {
      const m = /^[^:]+:modules\/ROOT\/pages\/([^:]+):\d+:(.*)$/.exec(line)
      if (!m) continue
      for (const x of m[2].matchAll(re)) if (includers.has(x[1])) includers.get(x[1]).push(m[1])
    }
  } else {
    for (const page of walk(pagesDir)) {
      const txt = readFileSync(page, 'utf8')
      for (const m of txt.matchAll(re)) if (includers.has(m[1])) includers.get(m[1]).push(relative(pagesDir, page))
    }
  }
  return partials.map(name => {
    const text = readFileSync(join(partialsDir, name), 'utf8')
    const parts = sentences(text).map(s => ({ kind: classify(s), text: s }))
    const kinds = [...new Set(parts.map(p => p.kind).filter(k => k !== 'ai' && k !== 'verify'))]
    return { name, kinds, parts, pages: includers.get(name) }
  })
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const refIdx = process.argv.indexOf('--ref')
  const inv = inventory(refIdx > 0 ? process.argv[refIdx + 1] : null)
  const outIdx = process.argv.indexOf('--out')
  if (process.argv.includes('--json') || outIdx > 0) {
    const json = JSON.stringify(inv, null, 2)
    if (outIdx > 0) writeFileSync(process.argv[outIdx + 1], json)
    else console.log(json)
  } else {
    const tally = {}
    for (const e of inv) {
      for (const k of e.kinds.length ? e.kinds : ['ai-only']) tally[k] = (tally[k] || 0) + 1
      console.log(`${e.name}\t[${e.kinds.join(',') || 'ai-only'}]\t${e.pages.length} page(s)`)
    }
    console.log(`\n${inv.length} partials; ${inv.filter(e => e.pages.length).length} in use`)
    console.log('classification tally:', JSON.stringify(tally))
  }
}
