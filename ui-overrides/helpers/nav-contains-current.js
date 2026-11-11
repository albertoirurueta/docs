'use strict'

// Handlebars helper `nav-contains-current` (Antora derives the helper name from this file name).
// Usage in a template: {{#if (nav-contains-current this @root.page.url)}}
// True when the nav entry `item` is the current page or has a descendant (in `item.items`) that is.
// Pure and recursive; an entry without `url` or without `items` is handled.
function navContainsCurrent (item, currentUrl) {
  if (!item || typeof item !== 'object' || currentUrl == null) return false
  if (item.url != null && item.url === currentUrl) return true
  const items = item.items
  if (!Array.isArray(items)) return false
  return items.some((child) => navContainsCurrent(child, currentUrl))
}

module.exports = navContainsCurrent
