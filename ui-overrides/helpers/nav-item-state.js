'use strict'

// Handlebars helper `nav-item-state` (Antora derives the helper name from this file name), used by
// ui-overrides/partials/nav-tree.hbs as {{#with (nav-item-state item ../level ../open @root.page.url) as |s|}}.
// It computes, once per nav entry, everything the partial needs:
//   depth        level of the entry (0 = the untitled list wrapper)
//   childLevel   level passed to the child list
//   current      the entry is the current page
//   onPath       the entry is the current page or contains it (in `items`, at any depth)
//   active       the entry is rendered open (is-active): depth 0, its parent asked for open children, or onPath
//   expand       its child list is emitted: depth 0 or 1 (groups and sections), parent asked for open children, or onPath
//   toggle       it has children and they are emitted, so it gets a toggle button
//   openChildren its children are rendered open: an untitled list wrapper or the "Open Source Projects" group
// Pure: Antora loads helper files on their own, so the containment check lives here rather than in a second file.

const OPEN_GROUP = 'Open Source Projects'

function containsCurrent (item, currentUrl) {
  if (!item || typeof item !== 'object' || currentUrl == null) return false
  if (item.url != null && item.url === currentUrl) return true
  const items = item.items
  if (!Array.isArray(items)) return false
  return items.some((child) => containsCurrent(child, currentUrl))
}

function navItemState (item, level, open, currentUrl) {
  const depth = typeof level === 'number' ? level : 0
  const parentOpen = open === true
  const onPath = containsCurrent(item, currentUrl)
  const expand = depth <= 1 || parentOpen || onPath
  const hasItems = Array.isArray(item && item.items) && item.items.length > 0
  return {
    depth,
    childLevel: depth + 1,
    current: !!item && item.url != null && item.url === currentUrl,
    onPath,
    active: depth === 0 || parentOpen || onPath,
    expand,
    toggle: hasItems && expand,
    openChildren: !!item && (!item.content || item.content === OPEN_GROUP),
  }
}

module.exports = navItemState
module.exports.containsCurrent = containsCurrent
