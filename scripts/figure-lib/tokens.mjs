// The theme token contract shared by the building blocks (lib/blocks.mjs), the product themes (themes/*.mjs) and the
// test that checks both. A theme is a plain object; every path below must resolve in it. Blocks read tokens only
// through `tok(theme, path)`, so a token that is not listed here cannot be used, and a theme that lacks one fails
// the test instead of drawing an invalid colour.

// Colours: one solid CSS colour each (hex or rgba()).
export const colourTokens = [
  'colour.canvas', // page background behind the content
  'colour.surface', // panels, cards, popovers, flyouts
  'colour.surfaceRaised', // secondary buttons, hover rows, chips
  'colour.inputBg', // form fields
  'colour.border', // weak 1px borders (panels, rows, dividers)
  'colour.borderStrong', // inputs and search boxes
  'colour.gridLine', // chart grid lines
  'colour.text', // primary text
  'colour.textMuted', // labels, inactive tabs, axis text, legend
  'colour.textFaint', // placeholders and disabled text
  'colour.textStrong', // big stat values
  'colour.textOnPrimary', // text on the primary button
  'colour.primary', // primary action fill
  'colour.secondary', // secondary button fill
  'colour.secondaryText',
  'colour.secondaryBorder',
  'colour.link',
  'colour.focus', // focus ring
  'colour.danger', // destructive action
  'colour.headerBg', // top bar (first bar)
  'colour.headerText',
  'colour.subHeaderBg', // second bar (breadcrumbs row)
  'colour.navBg', // navigation strip
  'colour.navText',
  'colour.navActiveBg', // selected navigation row
  'colour.navActiveBar', // marker of the selected navigation row
  'colour.chipBg', // breadcrumb and label chips
  'colour.chipText',
  'colour.tabActive', // text and underline of the selected tab
  'colour.editorBg', // query editor background
  'colour.editorText',
  'colour.syntax.keyword', // query editor syntax colours
  'colour.syntax.string',
  'colour.syntax.label',
  'colour.syntax.number',
  'colour.state.normal.bg', // alert state pills
  'colour.state.normal.text',
  'colour.state.pending.bg',
  'colour.state.pending.text',
  'colour.state.firing.bg',
  'colour.state.firing.text',
  'colour.state.nodata.bg',
  'colour.state.nodata.text',
  'colour.threshold.green', // gauge, stat and state-timeline colours
  'colour.threshold.yellow',
  'colour.threshold.orange',
  'colour.threshold.red',
  'colour.map.water', // basemap of the map panels (Kibana: Elastic Maps Service; Grafana: CARTO), read from its style
  'colour.map.land',
  'colour.map.border', // country boundaries of the basemap
];

// Typography and geometry: numbers, except the font stacks.
export const metricTokens = [
  'font.family',
  'font.mono',
  'font.size.small', // chips, axis text, table cells
  'font.size.body',
  'font.size.title', // panel and flyout titles
  'font.size.heading', // page title
  'font.size.stat', // stat value
  'size.controlHeight',
  'size.headerHeight',
  'size.navWidth',
  'radius.panel',
  'radius.control',
  'radius.badge',
];

export const tokenPaths = [...colourTokens, ...metricTokens];
export const seriesLength = 10; // theme.colour.series is an array of at least this many colours

export function get(theme, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), theme);
}

// Read one token; an undefined one is a bug in the theme, not something to paper over.
export function tok(theme, path) {
  const v = get(theme, path);
  if (v === undefined || v === null || v === '') throw new Error(`theme "${theme?.name}" has no token ${path}`);
  return v;
}

export function series(theme, i) {
  const s = theme.colour?.series;
  if (!Array.isArray(s) || s.length < seriesLength) throw new Error(`theme "${theme?.name}" needs colour.series with ${seriesLength} colours`);
  return s[i % s.length];
}

export function missingTokens(theme) {
  const missing = tokenPaths.filter((p) => {
    const v = get(theme, p);
    return v === undefined || v === null || v === '';
  });
  const s = theme.colour?.series;
  if (!Array.isArray(s) || s.length < seriesLength) missing.push('colour.series');
  for (const k of ['name', 'product', 'version', 'variant']) if (!theme[k]) missing.push(k);
  return missing;
}
