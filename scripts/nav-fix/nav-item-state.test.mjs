// Unit tests of ui-overrides/helpers/nav-item-state.js and of the ui-overrides/partials/nav-tree.hbs override
// that uses it. Run with `npm run test:nav`.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const navItemState = require('../../ui-overrides/helpers/nav-item-state.js')
const { containsCurrent } = navItemState
const Handlebars = require('handlebars')

// depth 0: group, depth 1: section, depth 2: subsection, depth 3: page
const fixture = {
  content: 'Group',
  url: '/group/index.html',
  items: [
    {
      content: 'Section',
      url: '/group/section/index.html',
      items: [
        {
          content: 'Subsection',
          url: '/group/section/sub/index.html',
          items: [{ content: 'Page', url: '/group/section/sub/page.html' }],
        },
      ],
    },
    { content: 'Leaf' },
  ],
}

test('containsCurrent: the entry itself, a deep descendant, absent', () => {
  assert.equal(containsCurrent(fixture, '/group/index.html'), true)
  assert.equal(containsCurrent(fixture, '/group/section/sub/page.html'), true)
  assert.equal(containsCurrent(fixture.items[0], '/group/section/sub/page.html'), true)
  assert.equal(containsCurrent(fixture, '/other/page.html'), false)
})

test('containsCurrent: entries without items or url', () => {
  assert.equal(containsCurrent({ content: 'Leaf', url: '/leaf.html' }, '/leaf.html'), true)
  assert.equal(containsCurrent(fixture.items[1], '/x.html'), false)
  assert.equal(containsCurrent({ items: [{ url: '/a.html' }] }, '/a.html'), true)
  assert.equal(containsCurrent({ items: [{ url: '/a.html' }] }, undefined), false)
})

test('navItemState: depth rules', () => {
  const page = '/other.html'
  const at = (level, open) => navItemState(fixture, level, open, page)
  assert.deepEqual([at(undefined).depth, at(undefined).active, at(undefined).expand], [0, true, true])
  assert.deepEqual([at(1).active, at(1).expand], [false, true])
  assert.deepEqual([at(2).active, at(2).expand, at(2).toggle], [false, false, false])
  assert.deepEqual([at(2, true).active, at(2, true).expand], [true, true])
  assert.equal(at(3).childLevel, 4)
})

test('navItemState: entry on the path of the current page is open at any depth', () => {
  const s = navItemState(fixture.items[0], 5, false, '/group/section/sub/page.html')
  assert.deepEqual([s.onPath, s.active, s.expand, s.toggle, s.current], [true, true, true, true, false])
  assert.equal(navItemState(fixture, 2, false, '/group/index.html').current, true)
})

test('navItemState: which children open', () => {
  assert.equal(navItemState({ items: [] }, 0, false, '/x').openChildren, true)
  assert.equal(navItemState({ content: 'Open Source Projects', items: [] }, 1, false, '/x').openChildren, true)
  assert.equal(navItemState({ content: 'Guides', items: [] }, 1, false, '/x').openChildren, false)
})

// Rendering of the partial with the helpers it uses (eq and relativize stubbed as in the UI bundle).
function render (navigation, pageUrl) {
  const hb = Handlebars.create()
  hb.registerHelper('eq', (a, b) => a === b)
  hb.registerHelper('relativize', (to) => to)
  hb.registerHelper('nav-item-state', navItemState)
  hb.registerPartial('nav-tree', readFileSync(new URL('../../ui-overrides/partials/nav-tree.hbs', import.meta.url), 'utf8'))
  return hb.compile('{{> nav-tree navigation=this}}')(navigation, { data: { root: { page: { url: pageUrl } } } })
}

const page = (name) => ({ content: name, url: `/${name}.html`, urlType: 'internal' })
const site = [
  {
    // untitled list wrapper (depth 0)
    items: [
      {
        content: 'Guides & References',
        items: [
          {
            content: 'Backend',
            url: '/backend.html',
            urlType: 'internal',
            items: [{ content: 'Spring', url: '/spring.html', urlType: 'internal', items: [page('spring-a'), page('spring-b')] }],
          },
          {
            content: 'Web',
            url: '/web.html',
            urlType: 'internal',
            items: [{ content: 'React', url: '/react.html', urlType: 'internal', items: [page('react-a')] }],
          },
        ],
      },
      { content: 'Open Source Projects', items: [{ content: 'Java Projects', items: [page('algebra')] }] },
    ],
  },
]

test('nav-tree: lists groups and sections, emits only the current branch below them', () => {
  const html = render(site, '/spring-b.html')
  for (const name of ['Guides & References', 'Backend', 'Web', 'Spring', 'spring-a', 'spring-b']) {
    assert.ok(html.includes(`>${name}<`), `${name} should be rendered`)
  }
  assert.ok(!html.includes('React'), 'subsections of other sections are not emitted')
  assert.ok(!html.includes('react-a'))
  assert.match(html, /nav-item is-current-page is-active" data-depth="4">\s*<a class="nav-link" href="\/spring-b.html">spring-b</)
  assert.match(html, /nav-item is-active" data-depth="2">\s*<button class="nav-item-toggle"><\/button>\s*<a class="nav-link" href="\/backend.html">Backend</)
  assert.match(html, /nav-item" data-depth="2">\s*<a class="nav-link" href="\/web.html">Web</, 'Web is closed and has no toggle')
})

test('nav-tree: "Open Source Projects" opens its project groups', () => {
  const html = render(site, '/spring-b.html')
  assert.match(html, /nav-item is-active" data-depth="2">\s*<button class="nav-item-toggle"><\/button>\s*<span class="nav-text">Java Projects</)
  assert.ok(html.includes('>algebra<'), 'children of an open project group are emitted')
})

test('nav-tree: the top-level groups are open', () => {
  const html = render(site, '/none.html')
  assert.match(html, /nav-item is-active" data-depth="1">\s*<button class="nav-item-toggle"><\/button>\s*<span class="nav-text">Guides & References</)
})
