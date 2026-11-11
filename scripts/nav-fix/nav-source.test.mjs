// Source-level nav checks (#394) and unit tests of the built-site check (check-dead-ends.mjs). Run with
// `npm run test:nav`. Every nav entry is either an xref link or a text-only group heading with children: a heading
// without children has nothing to open, and the nav-tree override never prunes headings (nav-item-state.js).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { navMenu, deadEnds, brokenLinks } from './check-dead-ends.mjs'

const root = new URL('../../modules/ROOT/', import.meta.url)

// nav.adoc with its include::partial$nav-*.adoc[] lines expanded, as [file, line, text] entries.
function navLines (file = new URL('nav.adoc', root), name = 'nav.adoc') {
  const out = []
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    const inc = line.match(/^include::partial\$([^[]+)\[\]\s*$/)
    if (inc) out.push(...navLines(new URL(`partials/${inc[1]}`, root), `partials/${inc[1]}`))
    else out.push([name, i + 1, line])
  })
  return out
}

test('every text-only nav entry is a group heading with children', () => {
  const entries = navLines()
    .map(([file, line, text]) => ({ file, line, m: text.match(/^(\*+)\s+(.*)$/) }))
    .filter((e) => e.m)
  const empty = []
  entries.forEach((e, i) => {
    if (/^xref:/.test(e.m[2])) return
    const next = entries[i + 1]
    if (!next || next.m[1].length <= e.m[1].length) empty.push(`${e.file}:${e.line} ${e.m[0]}`)
  })
  assert.deepEqual(empty, [], 'text-only nav entries without children')
})

test('check-dead-ends: finds headings without a child list, ignores open groups and links', () => {
  const nav = navMenu(`<div><nav class="nav-menu"><ul class="nav-list">
  <li class="nav-item" data-depth="4"> <span class="nav-text">Dead</span> </li>
  <li class="nav-item" data-depth="4"> <button class="nav-item-toggle"></button> <span class="nav-text">Group</span>
    <ul class="nav-list"><li class="nav-item" data-depth="5"> <a class="nav-link" href="a.html">A</a> </li></ul>
  </li>
</ul></nav></div><nav>other</nav>`)
  assert.deepEqual(deadEnds(nav), ['Dead'])
  assert.equal(navMenu('<html>no nav</html>'), '')
})

test('check-dead-ends: reports internal nav links whose target is missing', () => {
  const here = new URL('./check-dead-ends.mjs', import.meta.url).pathname
  const nav = '<a class="nav-link" href="nav-source.test.mjs#x"><a class="nav-link" href="missing.html">' +
    '<a class="nav-link" href="https://example.com/x.html"><a class="nav-link" href="#top">'
  assert.deepEqual(brokenLinks(nav, here), ['missing.html'])
})
