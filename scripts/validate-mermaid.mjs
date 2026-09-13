#!/usr/bin/env node
//
// Validate every Mermaid diagram embedded in the Antora pages.
//
// Antora does not parse Mermaid: `@sntke/antora-mermaid-extension` copies the diagram source into the
// generated HTML and `mermaid` renders it in the browser, so a diagram with a syntax error ships a green
// build and only fails where a reader can see it. This script closes that gap by running every block
// through the same parser the site renders with.
//
// `mermaid` and `jsdom` are deliberately NOT dependencies: this repository vendors node_modules, and
// the two of them pull in ~11k files for a validation-only tool. Install them on demand instead:
//
//     npm i --no-save mermaid@11 jsdom
//     npm run validate:mermaid
//
// Usage:  node scripts/validate-mermaid.mjs [rootDir]
// Exits 0 when every block parses, 1 otherwise (listing each failure as file:line).

import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'

const ROOT = process.argv[2] ?? 'modules/ROOT/pages'

let JSDOM, mermaid
try {
  ;({ JSDOM } = await import('jsdom'))
  // Mermaid expects a browser. Give it a minimal DOM before importing it.
  const dom = new JSDOM('<!doctype html><body></body>', { pretendToBeVisual: true })
  global.window = dom.window
  global.document = dom.window.document
  Object.defineProperty(global, 'navigator', { value: dom.window.navigator, configurable: true })
  mermaid = (await import('mermaid')).default
} catch (error) {
  if (error?.code !== 'ERR_MODULE_NOT_FOUND') throw error
  console.error(
    'This script needs mermaid and jsdom, which are installed on demand rather than vendored.\n' +
      'Run:\n\n    npm i --no-save mermaid@11 jsdom\n'
  )
  process.exit(2)
}

mermaid.initialize({ startOnLoad: false })

async function* adocFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) yield* adocFiles(path)
    else if (entry.name.endsWith('.adoc')) yield path
  }
}

// An AsciiDoc Mermaid block is `[mermaid]` followed by a delimited block. Both `....` (literal) and
// `----` (listing) are used across these pages, so accept either and require the closing delimiter to
// match the opening one.
function extractBlocks(text) {
  const lines = text.split('\n')
  const blocks = []
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() !== '[mermaid]') continue
    let j = i + 1
    while (j < lines.length && lines[j].trim() === '') j++ // tolerate a blank line after the attribute
    const delimiter = lines[j]?.trim()
    if (delimiter !== '....' && delimiter !== '----') continue
    const body = []
    let k = j + 1
    while (k < lines.length && lines[k].trim() !== delimiter) body.push(lines[k++])
    blocks.push({ line: j + 2, src: body.join('\n') }) // 1-based line of the first source line
    i = k
  }
  return blocks
}

let total = 0
const failures = []

for await (const file of adocFiles(ROOT)) {
  const text = await readFile(file, 'utf8')
  for (const { line, src } of extractBlocks(text)) {
    total++
    try {
      await mermaid.parse(src)
    } catch (error) {
      const message = String(error?.message ?? error).split('\n').slice(0, 6).join('\n      ')
      failures.push(`${relative(process.cwd(), file)}:${line}\n      ${message}`)
    }
  }
}

if (failures.length) {
  console.error(`\n${failures.length} of ${total} Mermaid diagrams failed to parse:\n`)
  for (const failure of failures) console.error(`  ${failure}\n`)
  process.exit(1)
}

console.log(`All ${total} Mermaid diagrams parsed successfully.`)
