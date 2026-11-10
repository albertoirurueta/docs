#!/usr/bin/env node
// One-shot relocation of the non-AI content of the per-topic disclaimer partials, followed by the switch of every
// page to the shared `partial$ai-disclaimer.adoc`. Writes scripts/disclaimers/relocation-map.json for the
// traceability check. Run once, before the partials are deleted. Usage: node scripts/disclaimers/relocate.mjs
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { inventory } from './inventory.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const pagesDir = join(root, 'modules/ROOT/pages')
const SHARED = 'include::partial$ai-disclaimer.adoc[]'
const MUST_KNOW = /(legacy|not legal advice|This is not ASP\.NET Core|frozen|security fixes only|Internet-Draft|in preview|raises the baseline|Atlas-only|never shipped)/i

const MAP_ONLY = process.argv.includes('--map-only') // rebuild the map from git HEAD without touching pages
const inv = inventory(MAP_ONLY ? 'HEAD' : null).filter(e => e.name !== 'ai-disclaimer.adoc')
const map = []

function admonition (sentences) {
  const kind = sentences.some(s => MUST_KNOW.test(s)) ? 'IMPORTANT' : 'NOTE'
  return `[${kind}]\n====\n${sentences.join('\n')}\n====\n`
}

/** Insert `block` after the first body paragraph that follows the include line. */
function afterIntro (text, includeLine, block) {
  const i = text.indexOf(includeLine)
  const bodyStart = text.indexOf('\n\n', i) + 2
  const end = text.indexOf('\n\n', bodyStart)
  return text.slice(0, end + 2) + block + '\n' + text.slice(end + 2)
}

for (const e of inv) {
  const resid = e.parts.filter(p => !['ai', 'bibliography', 'verify'].includes(p.kind))
  const include = `include::partial$${e.name}[]`
  const dirs = [...new Set(e.pages.map(p => dirname(p)))].sort((a, b) => a.length - b.length)
  let dest = null
  let placement = 'dropped'
  if (resid.length) {
    const versionS = resid.filter(p => p.kind === 'version').map(p => p.text)
    const otherS = resid.filter(p => p.kind !== 'version').map(p => p.text)
    if (e.pages.length === 1) {
      dest = e.pages[0]
      placement = 'page-admonition'
      const f = join(pagesDir, dest)
      let t = readFileSync(f, 'utf8')
      t = t.replace(include, () => `${include}\n\n${admonition(resid.map(p => p.text))}`.trimEnd())
      if (!MAP_ONLY) writeFileSync(f, t)
    } else {
      dest = join(dirs[0], 'index.adoc')
      const f = join(pagesDir, dest)
      if (!existsSync(f)) throw new Error(`no index for ${e.name}: ${dest}`)
      let t = readFileSync(f, 'utf8')
      if (!MAP_ONLY && !t.includes(include)) throw new Error(`${dest} does not include ${e.name}`)
      placement = []
      if (otherS.length) {
        if (!MAP_ONLY) t = afterIntro(t, include, admonition(otherS))
        placement.push('intro-admonition')
      }
      if (versionS.length) {
        const sec = `== Version baseline\n\n${versionS.join('\n')}\n\n`
        const m = MAP_ONLY ? null : /^== /m.exec(t.slice(t.indexOf(include)))
        if (MAP_ONLY) { /* map only */ } else if (m) { const at = t.indexOf(include) + m.index; t = t.slice(0, at) + sec + t.slice(at) } else t += `\n${sec}`
        placement.push('version-baseline')
      }
      placement = placement.join('+')
      if (!MAP_ONLY) writeFileSync(f, t)
    }
  }
  map.push({ partial: e.name, destination: dest, placement, residual: resid.map(p => ({ kind: p.kind, text: p.text })), dropped: e.parts.filter(p => ['ai', 'bibliography', 'verify'].includes(p.kind)).map(p => ({ kind: p.kind, text: p.text })), pages: e.pages.length })
}

// Switch every page to the shared partial (content already relocated above).
let switched = 0
for (const e of MAP_ONLY ? [] : inv) {
  for (const page of e.pages) {
    const f = join(pagesDir, page)
    const t = readFileSync(f, 'utf8')
    const n = t.split(`include::partial$${e.name}[]`).join(SHARED)
    if (n !== t) { writeFileSync(f, n); switched++ }
  }
}
writeFileSync(join(root, 'scripts/disclaimers/relocation-map.json'), JSON.stringify(map, null, 2) + '\n')
console.log(`relocated ${map.filter(m => m.residual.length).length} partials, switched ${switched} pages`)
