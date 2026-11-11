// Grafana 13.3.0, default theme (dark), font Inter. The values were read from the running lab
// (modules/ROOT/examples/monitoring-alerting-lab, profile `grafana`) on the computed styles of live elements at a
// 1440x900 viewport. This is the stated exception to the single-palette rule of scripts/cards/palette.mjs: the
// figures must look like the product, so the product's own colours are used, only through these tokens.
// NOT VERIFIED in the lab (conservative neutral values, marked below): light theme, hover and focus styles, the
// popover background, the monospace font and the syntax colours of the query editor, the No data state colours.
export default {
  name: 'grafana-13.3-dark',
  product: 'grafana',
  version: '13.3.0',
  variant: 'dark',
  font: {
    family: 'Inter, Helvetica, Arial, sans-serif',
    mono: "'Roboto Mono', Menlo, Consolas, monospace", // not measured
    size: { small: 12, body: 14, title: 14, heading: 28, stat: 44 },
  },
  size: { controlHeight: 32, headerHeight: 48, navWidth: 319 },
  radius: { panel: 10, control: 6, badge: 4 },
  colour: {
    canvas: '#111217',
    surface: '#181B1F',
    surfaceRaised: '#2C2F35',
    inputBg: '#111217',
    border: 'rgba(204,204,220,0.12)',
    borderStrong: 'rgba(204,204,220,0.2)',
    gridLine: 'rgba(204,204,220,0.07)', // not measured
    text: '#CCCCDC',
    textMuted: 'rgba(204,204,220,0.65)',
    textFaint: 'rgba(204,204,220,0.61)',
    textStrong: '#F7F8FA',
    textOnPrimary: '#FFFFFF',
    primary: '#3D71D9',
    secondary: '#2C2F35',
    secondaryText: '#CCCCDC',
    secondaryBorder: 'rgba(204,204,220,0.12)',
    link: '#6E9FFF',
    focus: '#3D71D9', // not measured exactly
    danger: '#D10E5C', // not measured exactly
    headerBg: '#181B1F',
    headerText: '#CCCCDC',
    subHeaderBg: '#111217',
    navBg: '#111217',
    navText: 'rgba(204,204,220,0.65)',
    navActiveBg: 'rgba(204,204,220,0.12)',
    navActiveBar: '#FF8833', // the real bar is a gradient from #F55F3E to #FF8833
    chipBg: '#2C2F35',
    chipText: '#CCCCDC',
    tabActive: '#CCCCDC',
    editorBg: '#111217', // not measured
    editorText: '#CCCCDC', // not measured
    syntax: { keyword: '#FF9830', string: '#73BF69', label: '#6E9FFF', number: '#F2CC0C' }, // from screenshots, approximate
    state: {
      normal: { bg: '#1A7F4B', text: '#FFFFFF' },
      pending: { bg: '#FF9900', text: '#000000' },
      firing: { bg: '#D10E5C', text: '#FFFFFF' },
      nodata: { bg: '#2C2F35', text: '#CCCCDC' }, // NOT VERIFIED: neutral grey
    },
    threshold: { green: '#73BF69', yellow: '#F2CC0C', orange: '#FF9830', red: '#F2495C' },
    // Default base layer of Geomap in the dark theme: CARTO Dark Matter, read from its style.json (layers background,
    // water and boundary_country_inner) in the lab on 2026-11-11.
    map: { water: '#2C353C', land: '#0E0E0E', border: '#5C5E5E' },
    series: ['#73BF69', '#F2CC0C', '#5794F2', '#FF9830', '#F2495C', '#B877D9', '#37872D', '#E0B400', '#1F60C4', '#FA6400'],
  },
};
