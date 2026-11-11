// Kibana 9.5.6, default theme (light, EUI "Borealis"), font Inter. The values were read from the running lab
// (modules/ROOT/examples/monitoring-alerting-lab, profile `kibana`) on the computed styles of live elements at a
// 1440x900 viewport. This is the stated exception to the single-palette rule of scripts/cards/palette.mjs: the
// figures must look like the product, so the product's own colours are used, only through these tokens.
// Chart colours inside canvas charts cannot be read from the DOM: `series` is the Borealis categorical palette from EUI
// (expected, NOT read from the lab). NOT VERIFIED: dark theme, hover and focus styles, tooltips, monospace font,
// chart axis and grid colours, the Recovered and No data state colours.
export default {
  name: 'kibana-9.5-light',
  product: 'kibana',
  version: '9.5.6',
  variant: 'light',
  font: {
    family: 'Inter, system-ui, Helvetica, Arial, sans-serif',
    mono: "'Roboto Mono', Menlo, Consolas, monospace", // not measured
    size: { small: 12, body: 14, title: 16, heading: 28, stat: 36 }, // heading and stat: screenshots, approximate
  },
  size: { controlHeight: 32, headerHeight: 48, navWidth: 248 },
  radius: { panel: 6, control: 4, badge: 4 },
  colour: {
    canvas: '#F6F9FC',
    surface: '#FFFFFF',
    surfaceRaised: '#ECF1F9', // the measured disabled-button fill, used for raised neutral surfaces
    inputBg: '#FFFFFF',
    border: '#CAD3E2',
    borderStrong: '#CAD3E2',
    gridLine: '#E3E8F2', // not measured
    text: '#1D2A3E',
    textMuted: '#516381',
    textFaint: '#798EAF',
    textStrong: '#1D2A3E',
    textOnPrimary: '#FFFFFF',
    primary: '#0B64DD',
    secondary: '#FFFFFF',
    secondaryText: '#1D2A3E',
    secondaryBorder: '#CAD3E2',
    link: '#1750BA',
    focus: '#0B64DD', // EUI focus ring, 2px, not measured exactly
    danger: '#BD271E', // not measured: EUI danger family
    headerBg: '#0B1628',
    headerText: '#FFFFFF',
    subHeaderBg: '#FFFFFF',
    navBg: '#FFFFFF',
    navText: '#1D2A3E',
    navActiveBg: '#D9E8FF',
    navActiveBar: '#0B64DD',
    chipBg: '#E3E8F2',
    chipText: '#516381',
    tabActive: '#1750BA',
    editorBg: '#FFFFFF', // not measured
    editorText: '#1D2A3E', // not measured
    syntax: { keyword: '#1750BA', string: '#00756F', label: '#A5336D', number: '#8A6A00' }, // not measured, approximate
    state: {
      normal: { bg: '#CCF3E1', text: '#00613D' }, // NOT VERIFIED: Recovered/ok not captured, neutral green tint
      pending: { bg: '#FCD883', text: '#6B4C00' }, // NOT VERIFIED
      firing: { bg: '#FFC9C2', text: '#8E1D12' }, // Active chip: pale red with dark red text, values approximate
      nodata: { bg: '#ECF1F9', text: '#516381' }, // NOT VERIFIED
    },
    threshold: { green: '#9ADC30', yellow: '#FEC514', orange: '#F5A700', red: '#F6726A' },
    // Basemap of Maps in the light theme: Elastic Maps Service "Road map - Desaturated", read from its style.json
    // (layers background, water and boundary-land-level-2) on 2026-11-11.
    map: { water: '#E7E7E7', land: '#FFFFFF', border: '#B3B3B3' },
    series: ['#16C5C0', '#A6EDEA', '#61A2FF', '#BFDBFF', '#EE72A6', '#FFC7DB', '#F6726A', '#FFC9C2', '#EAAE01', '#FCD883'],
  },
};
