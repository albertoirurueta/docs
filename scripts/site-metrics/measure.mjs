#!/usr/bin/env node
// Measures an Antora build directory: HTML file count, total size, sample page sizes,
// nav-menu HTML and the generator meta tag. Usage:
//   node scripts/site-metrics/measure.mjs <build-dir> [--json] [--out file]
//     [--guide path] [--section-index path] [--home path] [--algebra path] [--auth-server path]
//     [--no-nav]   (omit the nav HTML from the output)
// Sample paths are relative to the build directory. Exit code 2 if a sample page is missing.
import { readdirSync, readFileSync, statSync, writeFileSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

export const DEFAULT_SAMPLES = {
  guide: 'backend/monitoring-alerting/grafana/guide-add-a-data-source.html',
  'section-index': 'backend/monitoring-alerting/index.html',
  home: 'index.html',
  // {latest} is replaced by the highest version folder of the component found in the build
  algebra: 'irurueta-algebra/{latest}/index.html',
  'auth-server': 'irurueta-auth-server/{latest}/index.html',
}

// Highest version folder (by numeric segments) of a component in the build, or null when there is none.
export function latestVersionDir (root, component) {
  const dir = join(root, component)
  if (!existsSync(dir)) return null
  const versions = readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && /^\d+(\.\d+)*$/.test(e.name))
    .map((e) => e.name)
  if (!versions.length) return null
  const key = (v) => v.split('.').map(Number)
  versions.sort((a, b) => {
    const [x, y] = [key(a), key(b)]
    for (let i = 0; i < Math.max(x.length, y.length); i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) - (y[i] || 0)
    return 0
  })
  return versions[versions.length - 1]
}

export function resolveSample (root, rel) {
  const m = rel.match(/^([^/]+)\/\{latest\}\/(.*)$/)
  if (!m) return rel
  const version = latestVersionDir(root, m[1])
  return version ? `${m[1]}/${version}/${m[2]}` : rel
}

export function walkHtml (dir) {
  let count = 0
  let bytes = 0
  const stack = [dir]
  while (stack.length) {
    const d = stack.pop()
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name)
      if (e.isDirectory()) stack.push(p)
      else if (e.isFile() && e.name.endsWith('.html')) {
        count++
        bytes += statSync(p).size
      }
    }
  }
  return { count, bytes }
}

export function extractNav (html) {
  const start = html.search(/<nav class="nav-menu"[^>]*>/)
  if (start < 0) return null
  const re = /<\/?nav\b[^>]*>/g
  re.lastIndex = start
  let depth = 0
  let m
  while ((m = re.exec(html))) {
    depth += m[0].startsWith('</') ? -1 : 1
    if (depth === 0) return html.slice(start, m.index + m[0].length)
  }
  return null
}

export function extractGenerator (html) {
  const m = html.match(/<meta name="generator" content="([^"]*)"/)
  return m ? m[1] : null
}

export function measure (buildDir, samples = DEFAULT_SAMPLES, { nav = true } = {}) {
  const root = resolve(buildDir)
  const { count, bytes } = walkHtml(root)
  const result = { buildDir: root, htmlFiles: count, totalHtmlBytes: bytes, samples: {}, generator: null }
  for (const [key, sample] of Object.entries(samples)) {
    const rel = resolveSample(root, sample)
    const file = join(root, rel)
    if (!existsSync(file)) { result.samples[key] = { path: rel, missing: true }; continue }
    const html = readFileSync(file, 'utf8')
    const navHtml = extractNav(html)
    result.samples[key] = {
      path: rel,
      bytes: Buffer.byteLength(html),
      navBytes: navHtml ? Buffer.byteLength(navHtml) : 0,
      ...(nav ? { navHtml } : {}),
    }
    result.generator ??= extractGenerator(html)
  }
  return result
}

function main (argv) {
  const args = argv.slice(2)
  const samples = { ...DEFAULT_SAMPLES }
  let dir
  let json = false
  let out
  let nav = true
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a === '--json') json = true
    else if (a === '--no-nav') nav = false
    else if (a === '--out') out = args[++i]
    else if (a.startsWith('--') && a.slice(2) in samples) samples[a.slice(2)] = args[++i]
    else if (!a.startsWith('--') && !dir) dir = a
    else { console.error(`Unknown argument: ${a}`); process.exit(1) }
  }
  if (!dir) { console.error('Usage: measure.mjs <build-dir> [--json] [--out file] [--no-nav] [--guide p] [--section-index p] [--home p] [--algebra p] [--auth-server p]'); process.exit(1) }
  const r = measure(dir, samples, { nav })
  if (out) writeFileSync(out, JSON.stringify(r, null, 2))
  if (json) console.log(JSON.stringify(r, null, 2))
  else {
    const mb = (n) => (n / 1048576).toFixed(2) + ' MB'
    console.log(`Build:     ${r.buildDir}`)
    console.log(`HTML files: ${r.htmlFiles}`)
    console.log(`HTML size:  ${mb(r.totalHtmlBytes)} (${r.totalHtmlBytes} bytes)`)
    console.log(`Generator:  ${r.generator}`)
    for (const [k, s] of Object.entries(r.samples)) {
      console.log(s.missing ? `${k.padEnd(14)} MISSING ${s.path}` : `${k.padEnd(14)} ${String(s.bytes).padStart(9)} B (nav ${s.navBytes} B)  ${s.path}`)
    }
  }
  if (Object.values(r.samples).some((s) => s.missing)) process.exitCode = 2
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main(process.argv)
