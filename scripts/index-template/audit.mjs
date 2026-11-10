#!/usr/bin/env node
// Audits the `==` headings of all index pages (the 15 section indexes and every subsection index)
// against the WP4 index templates. Usage: node scripts/index-template/audit.mjs [--list] [--json]
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

export const SECTION_TEMPLATE = [
  'Sections',
  'Related material on this site',
  'Bibliography',
  'References',
]
export const SUBSECTION_TEMPLATE = [
  'Version baseline',
  "What's covered",
  'Reading path',
  'Running example',
  'Related material on this site',
  'Bibliography',
  'References',
]
// Synonyms to rename, used to suggest the template name in the report.
export const SYNONYMS = {
  'Reading path': ['Reading paths', 'New here? Read in this order', 'Learning path', 'Reading order',
    'How to read this section', 'Recommended reading path', 'Which pages should I read?', 'Choose your page'],
  'Related material on this site': ['Where related material lives elsewhere on this site', 'See also',
    'Related pages', 'Related material elsewhere on this site', 'Related sections'],
  "What's covered": ['Pages', 'Pages in this sub-section', 'Subsection map', 'Coverage map', "What's Covered",
    'Page map', 'Section map', 'The pages', 'Map of this subsection', 'What is covered'],
  'Running example': ['The Bookshelf scenario', 'The shelf scenario', 'Running scenario: Bookshelf',
    'The running example', 'The Bookshelf running example', 'The running scenario: Bookshelf',
    'The Bookshelf application', 'The heatflow scenario', 'Pocket Coffee across the subsection',
    'The running example: DocsAssistant'],
  'Version baseline': ['Release baseline', 'Check date and version baseline'],
}

const pagesDir = fileURLToPath(new URL('../../modules/ROOT/pages', import.meta.url))

export function collectIndexes(dir = pagesDir) {
  const out = []
  const visit = (d, depth) => {
    for (const name of readdirSync(d).sort()) {
      const p = join(d, name)
      if (statSync(p).isDirectory()) {
        if (depth < 2) visit(p, depth + 1)
      } else if (name === 'index.adoc' && depth >= 1) {
        out.push({ path: p, kind: depth === 1 ? 'section' : 'subsection' })
      }
    }
  }
  visit(dir, 0)
  return out
}

export function headings(text) {
  const out = []
  let fence = null
  for (const line of text.split('\n')) {
    const f = line.match(/^(-{4,}|\.{4,}|={4,}|`{3,}|\+{4,}|_{4,}|\*{4,})\s*$/)
    if (f) {
      if (fence === null) fence = f[1][0] + f[1].length
      else if (fence === f[1][0] + f[1].length) fence = null
      continue
    }
    if (fence) continue
    const m = line.match(/^==\s+(.+?)\s*$/)
    if (m) out.push(m[1])
  }
  return out
}

export function audit(entry) {
  const template = entry.kind === 'section' ? SECTION_TEMPLATE : SUBSECTION_TEMPLATE
  const found = headings(readFileSync(entry.path, 'utf8'))
  const problems = []
  let last = -1
  for (const h of found) {
    const i = template.indexOf(h)
    if (i === -1) {
      const hint = Object.entries(SYNONYMS).find(([, l]) => l.includes(h))
      problems.push(`non-template heading "${h}"${hint ? ` (rename to "${hint[0]}")` : ''}`)
    } else if (i < last) problems.push(`"${h}" is out of template order`)
    else last = i
  }
  if (new Set(found).size !== found.length) problems.push('duplicate template heading')
  if (entry.kind === 'subsection' && !found.includes('Bibliography')) problems.push('missing required "== Bibliography"')
  if (entry.kind === 'section' && !found.includes('Sections') && !entry.path.includes('git-and-github'))
    problems.push('missing "== Sections"')
  return { found, problems }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('../../', import.meta.url))
  const entries = collectIndexes()
  let bad = 0
  for (const e of entries) {
    const { found, problems } = audit(e)
    const rel = relative(root, e.path).split(sep).join('/')
    if (process.argv.includes('--list')) console.log(`${rel}: ${found.join(' | ')}`)
    if (problems.length) {
      bad++
      console.log(`${rel}`)
      for (const p of problems) console.log(`  - ${p}`)
    }
  }
  const sec = entries.filter((e) => e.kind === 'section').length
  console.log(`\n${entries.length} index pages audited (${sec} section, ${entries.length - sec} subsection): ${bad} with violations`)
  process.exit(bad ? 1 : 0)
}
