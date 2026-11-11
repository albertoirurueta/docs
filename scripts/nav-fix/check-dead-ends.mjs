#!/usr/bin/env node
// Built-site nav check (#394). Scans every HTML page under a built site (default build/site) and fails when its nav
// menu (<nav class="nav-menu">) has
//   - a dead-end heading: a text-only entry (<span class="nav-text">) with no child list, which a reader can neither
//     open nor follow; the nav-tree override must never prune a heading (ui-overrides/helpers/nav-item-state.js);
//   - a broken link: an internal nav link whose target file is not in the site.
// Run after `npx antora antora-playbook.yml`: `npm run test:nav:site` (or pass another site directory).
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs'
import { join, dirname, resolve, relative } from 'node:path'
import { pathToFileURL } from 'node:url'

const DEAD_END = /<span class="nav-text">([^<]*)<\/span>\s*<\/li>/g
const LINK = /<a class="nav-link" href="([^"]*)"/g

// The nav menu of a page, or '' when the page has none (redirect stubs, 404, Pagefind files).
export function navMenu (html) {
  const start = html.indexOf('<nav class="nav-menu">')
  if (start < 0) return ''
  const end = html.indexOf('</nav>', start)
  return end < 0 ? html.slice(start) : html.slice(start, end)
}

// Text of every text-only nav entry that has no child list.
export function deadEnds (nav) {
  return [...nav.matchAll(DEAD_END)].map((m) => m[1].trim())
}

// Internal nav link targets (relative hrefs, without fragment or query) that do not exist next to `file`.
export function brokenLinks (nav, file) {
  const broken = []
  for (const [, href] of nav.matchAll(LINK)) {
    if (/^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(href)) continue
    const path = decodeURIComponent(href.replace(/[#?].*$/, ''))
    if (!path) continue
    let target = resolve(dirname(file), path)
    if (path.endsWith('/')) target = join(target, 'index.html')
    else if (existsSync(target) && statSync(target).isDirectory()) target = join(target, 'index.html')
    if (!existsSync(target)) broken.push(href)
  }
  return broken
}

function * htmlFiles (dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name !== 'pagefind' && entry.name !== '_') yield * htmlFiles(path)
    } else if (entry.name.endsWith('.html')) yield path
  }
}

export function checkSite (siteDir) {
  const problems = []
  let pages = 0
  for (const file of htmlFiles(siteDir)) {
    const nav = navMenu(readFileSync(file, 'utf8'))
    if (!nav) continue
    pages++
    const rel = relative(siteDir, file)
    for (const text of deadEnds(nav)) problems.push(`${rel}: dead-end nav heading "${text}"`)
    for (const href of brokenLinks(nav, file)) problems.push(`${rel}: nav link to a missing page ${href}`)
  }
  return { pages, problems }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const siteDir = resolve(process.argv[2] || 'build/site')
  if (!existsSync(siteDir)) {
    console.error(`${siteDir} does not exist: build the site first (npx antora antora-playbook.yml)`)
    process.exit(2)
  }
  const { pages, problems } = checkSite(siteDir)
  const shown = problems.slice(0, 50)
  for (const p of shown) console.error(p)
  if (problems.length > shown.length) console.error(`... and ${problems.length - shown.length} more`)
  console.log(`${pages} pages with a nav checked, ${problems.length} problem(s)`)
  process.exit(problems.length ? 1 : 0)
}
