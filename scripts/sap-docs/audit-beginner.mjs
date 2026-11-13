#!/usr/bin/env node
// Audits the beginner-first structure of the reference pages of the ABAP and ERP sections: a plain-words
// introduction, `== Key terms` with a glossary link for every term, and `== Summary`.
// Usage: node scripts/sap-docs/audit-beginner.mjs [--list] [--json] [--dir <pages-subdirectory>]...
// Guides (`guide-*.adoc`) keep the guide template and are exempt, like every `index.adoc`. Glossaries, cheat sheets
// and bibliographies have their own fixed structure and are exempt as well.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { basename, dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../../', import.meta.url))
export const pagesDir = join(root, 'modules/ROOT/pages')
export const DEFAULT_DIRS = ['programming-languages/abap', 'erp'].map((d) => join(pagesDir, d))
export const MIN_INTRO_WORDS = 25

export function isExempt(name) {
  return (
    name === 'index.adoc' ||
    /^guide-/.test(name) ||
    /^glossary/.test(name) ||
    /^cheat-sheet/.test(name) ||
    name === 'bibliography.adoc'
  )
}

export function collectPages(dirs = DEFAULT_DIRS) {
  const out = []
  const visit = (d) => {
    if (!existsSync(d)) return
    for (const name of readdirSync(d).sort()) {
      const p = join(d, name)
      if (statSync(p).isDirectory()) visit(p)
      else if (name.endsWith('.adoc') && !isExempt(name)) out.push(p)
    }
  }
  for (const d of dirs) visit(d)
  return out
}

// Lines outside delimited blocks (listing, literal, example, sidebar, quote, passthrough and table blocks).
export function proseLines(text) {
  const out = []
  let fence = null
  const lines = text.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const f = line.match(/^(-{4,}|\.{4,}|={4,}|`{3,}|\+{4,}|_{4,}|\*{4,}|\|={3,})\s*$/)
    if (f) {
      const key = f[1][0] + f[1].length
      if (fence === null) fence = key
      else if (fence === key) fence = null
      continue
    }
    if (fence) continue
    out.push({ line, n: i + 1 })
  }
  return out
}

export function sections(text) {
  const result = []
  let current = { title: null, level: 0, lines: [] }
  for (const { line } of proseLines(text)) {
    const m = line.match(/^(={2,6})\s+(.+?)\s*$/)
    if (m && m[1].length === 2) {
      result.push(current)
      current = { title: m[2], level: 2, lines: [] }
    } else current.lines.push(line)
  }
  result.push(current)
  return result
}

// Words of plain prose in a block of lines: attribute entries, includes, comments, anchors, block macros and
// list or table markers do not count.
export function introWords(lines) {
  let words = 0
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue
    if (/^(=\s|:[\w-]+:|include::|image::|\/\/|\[\[|\[#|\[.*\]$|[*.-]\s|\|)/.test(line)) continue
    words += line.split(/\s+/).filter((w) => /[A-Za-z]/.test(w)).length
  }
  return words
}

// A key term is a bullet of the Key terms section. It needs an xref to a glossary page with a fragment.
export function keyTermItems(lines) {
  const items = []
  let cur = null
  for (const line of lines) {
    if (/^\*\s+/.test(line)) {
      if (cur) items.push(cur)
      cur = line.replace(/^\*\s+/, '')
    } else if (cur !== null && /^\s+\S/.test(line)) cur += ' ' + line.trim()
    else if (!line.trim()) {
      if (cur) items.push(cur)
      cur = null
    }
  }
  if (cur) items.push(cur)
  return items
}

const GLOSSARY_XREF = /xref:([^\s[#]*glossary[^\s[#]*\.adoc)#([^\s[\]]+)\[[^\]]*\]/g

export function glossaryAnchors(file) {
  const ids = new Set()
  const text = readFileSync(file, 'utf8')
  for (const { line } of proseLines(text)) {
    for (const m of line.matchAll(/\[\[([^\],]+)/g)) ids.add(m[1])
    for (const m of line.matchAll(/^\[#([^\],.%]+)/g)) ids.add(m[1])
    const h = line.match(/^={2,6}\s+(.+?)\s*$/)
    if (h) {
      ids.add('_' + h[1].toLowerCase().replace(/<[^>]+>/g, '').replace(/[^\w]+/g, '_').replace(/^_+|_+$/g, ''))
    }
  }
  return ids
}

function resolveGlossary(target, pagePath) {
  // Antora resource ids are relative to modules/ROOT/pages unless they start with a module; both forms are
  // tried, then the sibling directories of the page.
  const bare = target.replace(/^ROOT:/, '').replace(/^(page\$)/, '')
  const candidates = [join(pagesDir, bare), join(dirname(pagePath), bare), join(dirname(pagePath), basename(bare))]
  return candidates.find((c) => existsSync(c))
}

export function auditPage(pagePath, text = readFileSync(pagePath, 'utf8')) {
  const problems = []
  const secs = sections(text)
  const head = secs[0]
  const words = introWords(head.lines)
  if (words < MIN_INTRO_WORDS) {
    problems.push(`plain-words introduction missing or too short (${words} words before the first "==" heading, at least ${MIN_INTRO_WORDS})`)
  }
  const titles = secs.slice(1).map((s) => s.title)
  const key = secs.find((s) => s.title === 'Key terms')
  const summary = secs.find((s) => s.title === 'Summary')
  if (!key) problems.push('missing "== Key terms"')
  if (!summary) problems.push('missing "== Summary"')
  if (key && summary && titles.indexOf('Key terms') > titles.indexOf('Summary')) {
    problems.push('"== Key terms" must come before "== Summary"')
  }
  if (summary && summary.lines.every((l) => !l.trim())) problems.push('"== Summary" is empty')
  if (key) {
    const items = keyTermItems(key.lines)
    if (!items.length) problems.push('"== Key terms" has no bullet entries (one "* xref:...glossary.adoc#anchor[Term]: definition" per term)')
    items.forEach((item, i) => {
      const label = item.slice(0, 40)
      const links = [...item.matchAll(GLOSSARY_XREF)]
      if (!links.length) {
        problems.push(`key term ${i + 1} ("${label}") has no glossary link (xref:...glossary.adoc#anchor[...])`)
        return
      }
      for (const [, target, anchor] of links) {
        const file = resolveGlossary(target, pagePath)
        if (file && !glossaryAnchors(file).has(anchor)) {
          problems.push(`key term ${i + 1} ("${label}") links to "#${anchor}", which does not exist in ${target}`)
        }
      }
    })
  }
  return problems
}

export function auditAll(pages = collectPages()) {
  return pages.map((p) => ({ path: relative(root, p).split(sep).join('/'), problems: auditPage(p) }))
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2)
  const dirs = []
  for (let i = 0; i < args.length; i++) if (args[i] === '--dir') dirs.push(resolve(pagesDir, args[++i]))
  const results = auditAll(collectPages(dirs.length ? dirs : DEFAULT_DIRS))
  const bad = results.filter((r) => r.problems.length)
  if (args.includes('--json')) console.log(JSON.stringify(results, null, 2))
  else {
    if (args.includes('--list')) for (const r of results) console.log(`${r.path}: ${r.problems.length ? 'FAIL' : 'ok'}`)
    for (const r of bad) {
      console.log(r.path)
      for (const p of r.problems) console.log(`  - ${p}`)
    }
    console.log(`\n${results.length} pages audited: ${bad.length} with violations`)
  }
  process.exit(bad.length ? 1 : 0)
}
