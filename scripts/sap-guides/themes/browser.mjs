// A generic browser window with a page that shows an OData response (JSON or XML) as plain text. It is deliberately
// not a copy of any browser: neutral light colours, no browser name or logo, so no product's chrome is imitated. The text
// colours follow the Fiori Horizon neutrals of themes/sap-fiori.mjs (read from OpenUI5 1.154.0, Apache-2.0) so a figure
// that shows the browser next to a Fiori app looks consistent; the frame colours are plain greys chosen for contrast and
// are NOT measured from a running browser.
export default {
  name: 'browser-generic-light',
  product: 'browser',
  version: '1',
  variant: 'light',
  font: {
    family: 'Helvetica, Arial, sans-serif',
    mono: 'Menlo, Consolas, "Courier New", monospace',
    size: { small: 12, body: 14, title: 14, heading: 24, stat: 40 },
  },
  size: { controlHeight: 32, headerHeight: 40, navWidth: 220 },
  radius: { panel: 8, control: 6, badge: 4 },
  colour: {
    canvas: '#ffffff',
    surface: '#f5f6f7', // tab strip and address bar surround
    surfaceRaised: '#e5e5e5',
    inputBg: '#ffffff',
    border: '#d9d9d9',
    borderStrong: '#bcc3ca',
    gridLine: '#e5e5e5',
    text: '#131e29',
    textMuted: '#556b82',
    textFaint: '#758ca4',
    textStrong: '#131e29',
    textOnPrimary: '#ffffff',
    primary: '#0064d9',
    secondary: '#ffffff',
    secondaryText: '#0064d9',
    secondaryBorder: '#bcc3ca',
    link: '#0064d9',
    focus: '#0032a5',
    danger: '#aa0808',
    headerBg: '#f5f6f7',
    headerText: '#131e29',
    subHeaderBg: '#ffffff',
    navBg: '#f5f6f7',
    navText: '#131e29',
    navActiveBg: '#ebf8ff',
    navActiveBar: '#0064d9',
    chipBg: '#e5e5e5',
    chipText: '#131e29',
    tabActive: '#0064d9',
    editorBg: '#ffffff',
    editorText: '#131e29',
    syntax: { keyword: '#8b47d7', string: '#75980b', label: '#0064d9', number: '#c87b00' }, // JSON key, string, name and number stand-ins
    state: {
      normal: { bg: '#256f3a', text: '#ffffff' },
      pending: { bg: '#e76500', text: '#ffffff' },
      firing: { bg: '#aa0808', text: '#ffffff' },
      nodata: { bg: '#788fa6', text: '#ffffff' },
    },
    threshold: { green: '#256f3a', yellow: '#c87b00', orange: '#e76500', red: '#aa0808' },
    map: { water: '#ebf8ff', land: '#eff1f2', border: '#bcc3ca' },
    series: ['#168eff', '#c87b00', '#75980b', '#df1278', '#8b47d7', '#049f9a', '#0070f2', '#cc00dc', '#798c77', '#da6c6c'],
  },
};
