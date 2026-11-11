// Unit test of ui-overrides/helpers/nav-contains-current.js. Run with `npm run test:nav`.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const navContainsCurrent = createRequire(import.meta.url)('../../ui-overrides/helpers/nav-contains-current.js')

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

test('current page at depth 0 (the entry itself)', () => {
  assert.equal(navContainsCurrent(fixture, '/group/index.html'), true)
})

test('current page at depth 3', () => {
  assert.equal(navContainsCurrent(fixture, '/group/section/sub/page.html'), true)
  assert.equal(navContainsCurrent(fixture.items[0], '/group/section/sub/page.html'), true)
})

test('current page absent', () => {
  assert.equal(navContainsCurrent(fixture, '/other/page.html'), false)
})

test('entry without items', () => {
  const leaf = { content: 'Leaf', url: '/leaf.html' }
  assert.equal(navContainsCurrent(leaf, '/leaf.html'), true)
  assert.equal(navContainsCurrent(leaf, '/x.html'), false)
})

test('entry without url', () => {
  assert.equal(navContainsCurrent(fixture.items[1], '/x.html'), false)
  const wrapper = { items: [{ url: '/a.html' }] }
  assert.equal(navContainsCurrent(wrapper, '/a.html'), true)
  assert.equal(navContainsCurrent(wrapper, undefined), false)
})
